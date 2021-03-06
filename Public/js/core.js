$(function () {
    ucard();//绑定用户小名片
    $('input,area').placeholder();//修复ieplace holder
    //checkMessage();//检查一次消息
    if (is_login()) {
        checkMessage();//检查一次消息
        bindMessageChecker();//绑定用户消息
    } 
});

$(function () {
    /**
     * ajax-post
     * 将链接转换为ajax请求，并交给handleAjax处理
     * 参数：
     * data-confirm：如果存在，则点击后发出提示。
     * 示例：<a href="xxx" class="ajax-post">Test</a>
     */
    $(document).on('click', '.ajax-post', function (e) {
        //取消默认动作，防止跳转页面
        e.preventDefault();

        //获取参数（属性）
        var url = $(this).attr('href');
        var confirmText = $(this).attr('data-confirm');

        //如果需要的话，发出确认提示信息
        if (confirmText) {
            var result = confirm(confirmText);
            if (!result) {
                return false;
            }
        }

        //发送AJAX请求
        $.post(url, {}, function (a, b, c) {
            handleAjax(a);
        });
    });

    /**
     * ajax-form
     * 通过ajax提交表单，通过oneplus提示消息
     * 示例：<form class="ajax-form" method="post" action="xxx">
     */
    $(document).on('submit', 'form.ajax-form', function (e) {
        //取消默认动作，防止表单两次提交
        e.preventDefault();

        //禁用提交按钮，防止重复提交
        var form = $(this);
        $('[type=submit]', form).addClass('disabled');

        //获取提交地址，方式
        var action = $(this).attr('action');
        var method = $(this).attr('method');

        //检测提交地址
        if (!action) {
            return false;
        }

        //默认提交方式为get
        if (!method) {
            method = 'get';
        }

        //获取表单内容
        var formContent = $(this).serialize();

        //发送提交请求
        var callable;
        if (method == 'post') {
            callable = $.post;
        } else {
            callable = $.get;
        }
        callable(action, formContent, function (a) {
            handleAjax(a);
            $('[type=submit]', form).removeClass('disabled');
        });

        //返回
        return false;
    });
    follower.bind_follow();
    iMessage();
});

var follower = {
    'bind_follow': function () {
        $('[data-role="follow"]').unbind('click')
        $('[data-role="follow"]').click(function () {
            var $this = $(this);
            var uid = $this.attr('data-follow-who');
            $.post(U('Ucenter/Public/follow'), {uid: uid}, function (msg) {
                if (msg.status) {

                    $this.attr('class', $this.attr('data-before'));
                    $this.attr('data-role', 'unfollow');
                    $this.html('已关注');
                    follower.bind_follow();
                    toast.success(msg.info, '温馨提示');
                } else {
                    toast.error(msg.info, '温馨提示');
                }
            }, 'json');
        })

        $('[data-role="unfollow"]').unbind('click')
        $('[data-role="unfollow"]').click(function () {
            var $this = $(this);
            var uid = $this.attr('data-follow-who');
            $.post(U('Ucenter/Public/unfollow'), {uid: uid}, function (msg) {
                if (msg.status) {
                    $this.attr('class', $this.attr('data-after'));
                    $this.attr('data-role', 'follow');
                    $this.html('关注');
                    follower.bind_follow();
                    toast.success(msg.info, '温馨提示');
                } else {
                    toast.error(msg.info, '温馨提示');
                }
            }, 'json');
        })
    }
}

/**
 * 绑定回到顶部
 */

$(function () {
    $(window).on('scroll', function () {
        var st = $(document).scrollTop();
        if (st > 0) {
            $('#go-top').css('display','block');
        } else {
            $('#go-top').hide();
        }
    });
    $('#tool .go-top').on('click', function () {
        $('html,body').animate({'scrollTop': 0}, 500);
    });

    $('#go-top .uc-2vm').hover(function () {
        $('#go-top .uc-2vm-pop').removeClass('dn');
    }, function () {
        $('#go-top .uc-2vm-pop').addClass('dn');
    });
});

/**
 * 绑定登出事件
 */
$(function(){
    $('[event-node=logout]').click(function () {
        $.get(U('Ucenter/System/logout'), function (msg) {
            $('body').append(msg.html);
            toast.success(msg.message + '。', '温馨提示');
            setTimeout(function () {
                location.href = msg.url;
            }, 1500);
        }, 'json')
    });
})
/**
 * 更新附件表单值
 * @return void
 */
var upAttachVal = function (type, attachId, obj) {
    var $attach_ids = obj;
    var attachVal = $attach_ids.val();
    var attachArr = attachVal.split(',');
    var newArr = [];
    for (var i in attachArr) {
        if (attachArr[i] !== '' && attachArr[i] !== attachId.toString()) {
            newArr.push(attachArr[i]);
        }
    }
    type === 'add' && newArr.push(attachId);
    $attach_ids.val(newArr.join(','));
    return newArr;
}
jQuery.cookie = function (name, value, options) {
    name = cookie_config.prefix + name;
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options);
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

var message_session={
    message_type:'',
    init_message:function(){
        $('[data-role="open-slider-box"]').unbind();
        $('[data-role="open-slider-box"]').click(function () {
            toast.showLoading();
            $.post(U('Ucenter/Message/messagetypelist'),{},function(html){
                $('#message-type-box').find('.message-type-list').html(html);
                $('[data-role="open-message-list"]').first().click();
            });
            toast.hideLoading();
        });
    },
    list_message:function(){
        $('[data-role="open-message-list"]').unbind();
        $('[data-role="open-message-list"]').click(function(){
            //alert('sdfsdfsfs');
            message_type = $(this).attr("data-type");
             $.post(U('Ucenter/Message/messagelist'),{tab:message_type},function(html){
                $('.message-info-list').html(html);
            });
        });
    },
    list_message_load_more:function(){
        var page = 1;
        var r = 10;
        $('.loadmore-type-messages').unbind();
        $('.loadmore-type-messages').click(function(){
            var _this = $(this);
            _this.html('加载中');
            $.post(U('Ucenter/Message/messagelist'),{tab:message_type,page:page+1,r:r},function(html){
                if(html.length){
                    $('.message-info-list').append(html);
                    _this.html('加载更多');
                }else{
                    _this.html('已经没有喽');
                }
            });
        });
    }
};

var Notify = {
    'readMessage': function (obj, message_id) {
        var url = $(obj).attr('data-url');
        if( url !=''){
            toast.showLoading();
            $.post(U('Ucenter/Public/readMessage'), {message_id: message_id}, function (msg) {
                toast.hideLoading();
                location.href = url;
            }, 'json');
        }

    },
    /**
     * 将所有的消息设为已读
     */
    'setAllReaded': function () {
        $.post(U('Ucenter/Public/setAllMessageReaded'), function () {
            $hint_count.text(0);
            $('#nav_message').html('<div style="font-size: 18px;color: #ccc;font-weight: normal;text-align: center;line-height: 150px">暂无任何消息!</div>');
            $nav_bandage_count.hide();
            $nav_bandage_count.text(0);

        });
    }
};
