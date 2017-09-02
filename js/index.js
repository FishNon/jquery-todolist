;(function () {
    "use strict";
    var $form_add_task = $('.add-task');
    var task_list = [];
    var $delete_task = null;
    var $task_detail = $('.task-detail');
    var $task_detail_mask = $('.task-detail-mask');
    var $detail_task = null;
    var current_index;
    var $update_form = null;
    var $task_detail_content = null;
    var $task_detail_content_input = null;
    var $check_complete = null;

    init();
    $form_add_task.on('submit', function (e) {

        var new_task = {};

        // 阻止默认事件
        e.preventDefault();

        // 获取新task的值
        var $input = $(this).find('input[name="content"]');
        new_task.content = $input.val();
        new_task.desc = '';
        new_task.remind_date = '';

        // 如果新task值为空，则直接返回
        if (!new_task.content) return;

        // 如果不为空，则继续执行
        add_task(new_task);

        $input.val('');
    });

    // 初始化
    function init() {
        // store.clear();
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
    }

    // 监听删除
    function listen_delete_task() {
        $delete_task.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            confirm('确认删除？');
            delete_task(index);
        });
    }

    // 监听详情
    function listen_detail_task() {
        $detail_task.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            show_task_detail(index);
        });
    }

    // 监听遮罩
    function listen_mask() {
        $task_detail_mask.on('click', function () {
            // var $this = $(this);
            // var $item =
            hide_task_detail();
        })
    }

    // 监听checkbox
    function listen_check_complete() {
        $check_complete.on('click', function () {
            var index = $(this).parent().parent().data('index');
            var item = store.get('task_list')[index];
            if (item && item.complete) {
                update_task_detail(index, {complete: false});
            } else {
                update_task_detail(index, {complete: true});
            }
        });
    }

    // 添加任务
    function add_task(new_task) {
        task_list.push(new_task);

        // 更新localstorage
        refresh_task_list();
    }

    // 渲染task_list
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');

        for (var i = 0; i < task_list.length; i++) {
            var item = task_list[i];
            if (item && item.complete) {
                $task = render_task_tpl(item, i);
                $task_list.append($task);
            } else {
                var $task = render_task_tpl(item, i);
                $task_list.prepend($task);
            }
        }

        $delete_task = $('.action.delete');
        $detail_task = $('.action.detail');
        $check_complete = $('.task-list .complete[type=checkbox]');

        listen_delete_task();
        listen_detail_task();
        listen_check_complete();
        listen_mask();
    }

    // task_item内容设置
    function render_task_tpl(data, index) {
        if (!data || index < 0) return;
        return '<div class="task-item '+(data.complete?'completed':'')+'" data-index = ' + index + '> <span> <input class="complete" type="checkbox" ' + (data.complete ? 'checked' : '') + '/></span><span class="task-content">' + data.content + '</span> <span  class="fr"><span class="action delete">删除</span> <span class="action detail">详情</span></span></span> </div>';
    }

    // 删除任务
    function delete_task(index) {
        if (index == undefined || !task_list[index]) return;
        delete task_list[index];

        refresh_task_list();
    }

    // 更新localstorage
    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    // 详情显示
    function show_task_detail(index) {
        render_task_detail(index);
        current_index = index;
        $task_detail.show();
        $task_detail_mask.show();
    }

    // 渲染任务详情
    function render_task_detail(index) {
        if (index === undefined || !task_list[index]) return;
        var item = task_list[index];
        var tpl = '<form><div class="content">' + item.content + '</div> <div><input style="display:none;" type="text" name="content" value="' + item.content + '"/></div><div> <div  class="desc"> <textarea name="desc" >' + item.desc + '</textarea> </div> </div> <div class="remind"> <input name="remind_date" value="' + item.remind_date + '" type="date"/> </div><button type="submit">更新</button></button></form>';

        $task_detail.html('');
        $task_detail.html(tpl);

        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find('.content');

        $task_detail_content.on('dblclick', function () {
            $task_detail_content_input = $update_form.find('[name=content]');
            $task_detail_content_input.show();
            $task_detail_content.hide();
        });

        $update_form.on('submit', function (e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();

            update_task_detail(index, data);

            hide_task_detail();
        })
    }

    // 更新任务详情
    function update_task_detail(index, data) {
        if (index < 0 || !task_list[index]) return;
        task_list[index] = $.extend({}, task_list[index], data);

        refresh_task_list();
    }

    // 详情隐藏
    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

})();
