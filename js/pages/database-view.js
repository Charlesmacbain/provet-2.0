/**
 * Database view renderer — renders the Views page with filterable, groupable tables.
 * @module pages/database-view
 */

import { VIEW_SOURCES } from '../data/view-sources.js';

let dbvActiveSource = 'invoices';
let dbvGroupBy = 'none';
let dbvVisibleCols = {};
let dbvShowProps = false;
let dbvFilterOpen = false;

// Initialize visible columns for each source
Object.keys(VIEW_SOURCES).forEach(k => {
  dbvVisibleCols[k] = [...VIEW_SOURCES[k].columns];
});

/**
 * Get CSS class for a status pill based on its value.
 * @param {string} v - Status value
 * @returns {string} CSS class name
 */
function statusPillClass(v) {
  v = (v || '').toLowerCase();
  if ('paid completed active approved confirmed'.includes(v)) return 'green';
  if ('pending in progress sent sent to lab scheduled partial'.includes(v)) return 'yellow';
  if ('overdue inactive expired cancelled'.includes(v)) return 'red';
  if ('draft pending approval'.includes(v)) return 'gray';
  return 'blue';
}

/**
 * Render the database view HTML.
 * @returns {string} HTML string
 */
export function renderDbView() {
  var src = VIEW_SOURCES[dbvActiveSource], cols = dbvVisibleCols[dbvActiveSource] || src.columns, data = src.data;
  var groups = null;
  if (dbvGroupBy !== 'none' && cols.includes(dbvGroupBy)) {
    groups = {};
    data.forEach(function(r) {
      var g = r[dbvGroupBy] || '\u2014';
      if (!groups[g]) groups[g] = [];
      groups[g].push(r);
    });
  }
  var thHtml = cols.map(function(c) { return '<th>' + c + '</th>'; }).join('');

  function buildRows(rows) {
    return rows.map(function(row) {
      return '<tr>' + cols.map(function(c) {
        var val = row[c] || '\u2014';
        if (c === 'ID') return '<td class="col-id">' + val + '</td>';
        if (c === 'Status') return '<td><span class="dbv-pill ' + statusPillClass(val) + '"><span class="pill-dot" style="background:currentColor;opacity:0.6"></span>' + val + '</span></td>';
        if (c === 'Priority') {
          var pc = val === 'Urgent' ? 'red' : val === 'High' ? 'yellow' : 'gray';
          return '<td><span class="dbv-pill ' + pc + '">' + val + '</span></td>';
        }
        return '<td>' + val + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  var tableBody = '';
  if (groups) {
    var gc = { 'Paid':'#57ab5a','Completed':'#57ab5a','Active':'#57ab5a','Approved':'#57ab5a','Confirmed':'#57ab5a','Pending':'#cf8e3e','In progress':'#cf8e3e','Overdue':'#e5534b','Inactive':'#e5534b','Draft':'#888','Scheduled':'#5e6ad2','Sent':'#cf8e3e','Partial':'#cf8e3e','Expired':'#e5534b','Sent to lab':'#cf8e3e','Pending approval':'#cf8e3e' };
    Object.keys(groups).forEach(function(gn) {
      var co = gc[gn] || '#888';
      tableBody += '<tr><td colspan="' + cols.length + '"><div class="dbv-group-header"><span class="g-arrow">\u25BC</span><span class="g-dot" style="background:' + co + '"></span>' + gn + '<span class="g-count">' + groups[gn].length + '</span></div></td></tr>';
      tableBody += buildRows(groups[gn]);
    });
  } else {
    tableBody = buildRows(data);
  }

  var srcTabs = Object.keys(VIEW_SOURCES).map(function(k) {
    return '<div class="dbv-source-tab' + (k === dbvActiveSource ? ' active' : '') + '" data-dbv-src="' + k + '">' + VIEW_SOURCES[k].label + '</div>';
  }).join('');

  var filterItems = src.filterFields.map(function(f) {
    return '<div class="dbv-filter-item"><i data-lucide="hash"></i>' + f + '<span class="fi-arrow"><i data-lucide="chevron-right"></i></span></div>';
  }).join('');

  var colChips = src.columns.map(function(c) {
    return '<span class="dbv-col-chip ' + (cols.includes(c) ? 'on' : 'off') + '" data-dbv-col="' + c + '">' + c + '</span>';
  }).join('');

  var groupOpts = '<option value="none">No grouping</option>' + src.columns.filter(function(c) { return c !== 'ID' && c !== 'Notes'; }).map(function(c) {
    return '<option value="' + c + '"' + (c === dbvGroupBy ? ' selected' : '') + '>' + c + '</option>';
  }).join('');

  return '<div class="dbv-page">'
    + '<div class="dbv-header"><div class="dbv-title-row"><span class="dbv-title-icon"><i data-lucide="layout-grid"></i></span><input class="dbv-title-input" value="All ' + src.label.toLowerCase() + '" /><div class="dbv-save-row"><span style="font-size:12px;color:rgba(0,0,0,0.35)">Save to</span><button class="dbv-save-btn ghost"><i data-lucide="lock" style="width:12px;height:12px;margin-right:2px"></i> Personal</button><button class="dbv-save-btn ghost">Cancel</button><button class="dbv-save-btn primary">Save</button></div></div><input class="dbv-desc-input" placeholder="Description (optional)" /></div>'
    + '<div class="dbv-source-tabs">' + srcTabs + '<div class="dbv-filter-icon" id="dbvFilterToggle" style="margin-left:8px;"><i data-lucide="filter"></i>' + (dbvFilterOpen ? '<div class="dbv-filter-dropdown" id="dbvFilterDropdown"><div class="dbv-filter-search"><i data-lucide="search"></i><input placeholder="Add Filter..." /><span style="font-size:10px;color:rgba(0,0,0,0.25);font-family:monospace">F</span></div>' + filterItems + '</div>' : '') + '</div></div>'
    + '<div class="dbv-toolbar"><button class="dbv-tool-btn' + (dbvGroupBy !== 'none' ? ' has-value' : '') + '" id="dbvGroupBtn" style="position:relative"><i data-lucide="layers"></i> Grouping<select id="dbvGroupSelect" style="position:absolute;opacity:0;inset:0;cursor:pointer;width:100%;height:100%">' + groupOpts + '</select></button><button class="dbv-tool-btn" id="dbvSortBtn"><i data-lucide="arrow-up-down"></i> Ordering</button><div class="dbv-tool-spacer"></div><button class="dbv-tool-btn" id="dbvPropsToggle"><i data-lucide="sliders-horizontal"></i> Display</button></div>'
    + '<div class="dbv-table-wrap"><table class="dbv-table"><thead><tr>' + thHtml + '</tr></thead><tbody>' + tableBody + '<tr><td colspan="' + cols.length + '"><div class="dbv-add-row"><i data-lucide="plus"></i> New ' + src.label.slice(0, -1).toLowerCase() + '</div></td></tr></tbody></table></div>'
    + (dbvShowProps ? '<div class="dbv-props-panel" id="dbvPropsPanel"><div class="dbv-props-header"><h4>Display properties</h4><button class="dbv-props-close" id="dbvPropsClose"><i data-lucide="x"></i></button></div><div class="dbv-props-body"><div class="dbv-props-section"><div class="dbv-props-row"><span class="dbv-props-row-label">Grouping</span><select class="dbv-props-select" id="dbvPropsGroupSelect">' + groupOpts + '</select></div><div class="dbv-props-row"><span class="dbv-props-row-label">Ordering</span><select class="dbv-props-select"><option>Default</option>' + src.columns.map(function(c) { return '<option>' + c + '</option>'; }).join('') + '</select></div></div><div class="dbv-props-section"><div class="dbv-props-section-title">Display properties</div><div class="dbv-col-chips">' + colChips + '</div></div></div></div>' : '')
    + '</div>';
}

/**
 * Bind event handlers for the database view.
 * @param {HTMLElement} container - The container element
 */
export function wireDbView(container) {
  container.querySelectorAll('.dbv-source-tab[data-dbv-src]').forEach(function(tab) {
    tab.onclick = function() {
      dbvActiveSource = tab.dataset.dbvSrc;
      dbvGroupBy = 'none';
      dbvShowProps = false;
      dbvFilterOpen = false;
      refreshDbView(container);
    };
  });

  var ft = container.querySelector('#dbvFilterToggle');
  if (ft) ft.onclick = function(e) {
    if (e.target.closest('.dbv-filter-dropdown')) return;
    dbvFilterOpen = !dbvFilterOpen;
    refreshDbView(container);
  };

  var gs = container.querySelector('#dbvGroupSelect');
  if (gs) gs.onchange = function() { dbvGroupBy = gs.value; refreshDbView(container); };

  var pt = container.querySelector('#dbvPropsToggle');
  if (pt) pt.onclick = function() { dbvShowProps = !dbvShowProps; refreshDbView(container); };

  var pc = container.querySelector('#dbvPropsClose');
  if (pc) pc.onclick = function() { dbvShowProps = false; refreshDbView(container); };

  var pgs = container.querySelector('#dbvPropsGroupSelect');
  if (pgs) pgs.onchange = function() { dbvGroupBy = pgs.value; refreshDbView(container); };

  container.querySelectorAll('.dbv-col-chip[data-dbv-col]').forEach(function(chip) {
    chip.onclick = function() {
      var col = chip.dataset.dbvCol, vis = dbvVisibleCols[dbvActiveSource];
      if (vis.includes(col)) {
        if (vis.length > 1) dbvVisibleCols[dbvActiveSource] = vis.filter(function(c) { return c !== col; });
      } else {
        dbvVisibleCols[dbvActiveSource] = [].concat(VIEW_SOURCES[dbvActiveSource].columns).filter(function(c) { return vis.includes(c) || c === col; });
      }
      refreshDbView(container);
    };
  });

  if (dbvFilterOpen) {
    setTimeout(function() {
      var closer = function(ev) {
        if (!ev.target.closest('#dbvFilterToggle') && !ev.target.closest('.dbv-filter-dropdown')) {
          dbvFilterOpen = false;
          refreshDbView(container);
          document.removeEventListener('click', closer);
        }
      };
      document.addEventListener('click', closer);
    }, 0);
  }
}

/**
 * Re-render the database view within a container.
 * @param {HTMLElement} container - The container element
 */
export function refreshDbView(container) {
  container.innerHTML = renderDbView();
  lucide.createIcons({ nodes: container.querySelectorAll('i') });
  wireDbView(container);
}
