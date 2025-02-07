'use strict';
'require form';
'require fs';
'require uci';
'require view';

const symbol_link = '/etc/ppp/ip-down.d/check_wan6_down.sh';
const script_path = '/usr/share/wait-wan6-down/wait_wan6_down.sh';
const true_value = 'true';
const false_value = '';

function getStatus() {
    return L.resolveDefault(fs.stat(symbol_link), null).then(function (res) {
        return !!res ? true_value : false_value;
    });
}

function updateStatus() {
    getStatus().then(function (enabled) {
        var button_view = document.getElementById('switch_button');
        button_view.innerText = _(enabled ? 'Disable' : 'Enable');
        button_view.value = enabled;
        button_view.classList.remove('spinning');
        button_view.disabled = false;
    });

}

function switchStatus(ev) {
    var item = ev.currentTarget;
    var enabled = item.value;
    if (enabled) {
        fs.remove(symbol_link).then(updateStatus);
    } else {
        fs.exec_direct('/bin/ln', ['-s', script_path, symbol_link]).then(updateStatus);
    }
    item.classList.add('spinning');
    item.disabled = true;
}


function renderStatus(enabled) {
    var lable = E('label', {'class': 'cbi-value-title'}, _('Toggle switch'));
    var button = E('button', {
        'class': 'cbi-button cbi-button-apply',
        'id': 'switch_button',
        'value': enabled,
        'click': switchStatus
    }, _(enabled ? 'Disable' : 'Enable'));
    return E('div', {'class': 'cbi-value'}, [lable, button])
}

return view.extend({
    load: function () {
        return Promise.all([
            L.resolveDefault(getStatus()),
            uci.load('wait-wan6-down')
        ]);
    },
    render: function (load_result) {
        var m, s, o;

        m = new form.Map('wait-wan6-down', _('Wait Wan6 Down'),
            _('A Luci application that uses script to wait for wan6 down when ppp lcp terminated.'));

        s = m.section(form.TypedSection);
        s.anonymous = true;
        s.addremove = false;
        s.render = renderStatus.bind(null, load_result[0]);

        s = m.section(form.TypedSection, 'wait-wan6-down', _('Configration'));
        s.anonymous = true;

        o = s.option(form.Value, 'interval', _('Interval'), _('Retry delay (seconds)'));
        o.default = '1';
        o.datatype = 'uinteger';
        o.rmempty = false;

        o = s.option(form.Value, 'times', _('Attempt Times'));
        o.default = '10';
        o.datatype = 'uinteger';
        o.rmempty = false;

        return m.render();
    }
});
