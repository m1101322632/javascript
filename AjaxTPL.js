/**
  * ajax通用模板:
  *     定义了平时ajax通用的一些操作
  *     
  * @dependency:
  *    1.依赖jquery插件
  *    
  * @sicne 2016-02-22
  * @author xuxiaozhou
  * @version 1.0 
  */
var Ajax = function ( oConf ) 
{
        this.fInit( oConf );
};

Ajax.prototype = {
        oConf: {
                oUrl: {
                        sSomActionUrl: 'your_url'
                }
        },
        
        /**
         * @desc 初始化函数
         *      1. 给页面元素绑定事件
         *      2. 初始化配置项目
         * -------------------------------------------------------------------------
         * @param Object oConf: 配置项
         * -------------------------------------------------------------------------
        */
        fInit: function ( oConf ) 
        {
                this.oConf  = oConf? this.fInitConf( this.oConf, oConf): this.oConf; 
        },
       
        /**
         * @desc 初始化配置项
         * -------------------------------------------------------------------------
         * @param Object oConf: 配置项
         * -------------------------------------------------------------------------
        */
        fInitConf: function( oOrginConf, oTargetConf ) {
    		if ( typeof( oOrginConf ) !== 'object' ) {
                    return typeof ( oTargetConf ) !== 'undefined'? oTargetConf: oOrginConf;
            }         
    		else {
    		        oTargetConf = oTargetConf || {};	
    		}
    		
            for ( var index in oOrginConf ) {
            	
            	    if ( typeof( oOrginConf[ index ] ) !== 'object' ) {
            	    	    oTargetConf[ index ] = typeof( oTargetConf[ index ] ) != 'undefined'? oTargetConf[ index ]: oOrginConf[ index ];     
            	    }
            	    else {
            	        	oTargetConf[ index ] = this.fInitConf( oOrginConf[ index ], oTargetConf[ index ] );
            	    }
            }
            return oTargetConf;
        },
        
        /**
         * @desc 控制点击后显示或关闭的编辑页
         * -------------------------------------------------------------------------
         * @param string sAction :  open/close
         * -------------------------------------------------------------------------
         * @param Event oTrigerButton: 触发事件的按钮
         * -------------------------------------------------------------------------
        */
        fControlSomeActionDisplay: function ( sAction, oTrigerButton ) 
        {
                if ( sAction == 'open' ) {
                        //打开/显示编辑页
                }
                else if ( sAction == 'close' ) {
                       //关闭/隐藏编辑页 
                }
        },
        
        /**
         * @desc 执行动作前数据检测
         * -------------------------------------------------------------------------
         * @param Object oParam: 待检测的参数
         * -------------------------------------------------------------------------
        */
        fCheckSomeDataBeforeSomeAction: function ( oParam ) 
        {
                var oValidate = {
                                name: {
                                        sType: 'length',
                                        nMin: 1,
                                        nMax:50,
                                        sTipLocation: '', //提示信息元素的jquery选择器
                                        col_name: '关键词',
                                        sTipInfo: '长度必须在1-50个字符之间'
                                },
                                mainKeywordsId: {
                                        sType: 'regular',  
                                        sReg: '^\\d+$',
                                        sTipLocation:  '',
                                        col_name: '所属主关键词id',
                                        sTipInfo: '仅接受数字'
                                }
                        };
                        var bCheckResult  = this.fValidateData(oParam, oValidate); 
                        if (!bCheckResult.bPass ) {
                               var err_msg = "";
                                for( var sIdx in bCheckResult.oMsg ) {
                                        err_msg += oValidate[sIdx].col_name + ":" + bCheckResult.oMsg[sIdx] + "\r";
                                }
                                alert(err_msg);
                        }
                        return bCheckResult.bPass;
        },
         
        /**
         * @desc 异步执行某些操作
         *  -------------------------------------------------------------------------
         * @param Event oTrigerButton: 触发事件的按钮
         *  -------------------------------------------------------------------------
         */
        fSomeActionAjax: function ( oTrigerButton ) 
        {
                var oData = {}, oSelf = this;
                if ( this.fCheckSomeDataBeforeSomeAction() ) {
                        $.ajax({
                                url: this.oConf.oUrl.sSomActionUrl,
                                data: oData,
                                success: function( oData ) {
                                        oSelf.fSomeActionAjaxCallBack( oData, oTrigerButton );
                                },
                                context: this,
                                dataType: 'json',
                                type: 'post'
                        });
                } 
        },
        
        /**
         * @desc 异步执行某些操作
         *  -------------------------------------------------------------------------
         * @param Event oTrigerButton: 触发事件的按钮
         *  -------------------------------------------------------------------------
         * @param Object oData: 异步返回的数据
         *  -------------------------------------------------------------------------
         */
        fSomeActionAjaxCallBack: function ( oData, oTrigerButton ) 
        {
                if ( oData.code == 1 ) {
                        //回调成功时做的操作
                }
                else {
                      //回调失败时做的操作
                }
                alert(oData.msg);
        },
        
        /**
         * 数据验证
         * -------------------------------------------------------------------------
         * @param object oParam :  待验证的数据
         * -------------------------------------------------------------------------
         * @param object oValidater: 验证器
         * -------------------------------------------------------------------------
         */
        fValidateData: function(oParam, oValidater) 
        {
                var oValidateResult = {
                        bPass: true, 
                        oMsg: {}                 
                };
                var oReg = new RegExp();
                for (var sParaName in oParam) {
                         
                        if ( typeof(oValidater[sParaName]) !== 'undefined' ) {
                                 
                                switch ( oValidater[sParaName].sType ) {
                                        case 'length':
                                         
                                                if ( oParam[sParaName].length < oValidater[sParaName].nMin || oParam[sParaName].length > oValidater[sParaName].nMax) {
                                                        oValidateResult.bPass = false;
                                                        oValidateResult.oMsg[sParaName] =  oValidater[sParaName].sTipInfo;
                                                        $(  oValidater[sParaName].sTipLocation ).text( oValidater[sParaName].sTipInfo );
                                                }
                                                else {
                                                        $( oValidater[sParaName].sTipLocation ).text( '' );
                                                }
                                                break;
                                        case 'regular':
                                                oReg.compile( oValidater[sParaName].sReg );
                                         
                                                if ( !oReg.test(oParam[sParaName]) ) {
                                                        oValidateResult.bPass = false;
                                                        oValidateResult.oMsg[sParaName] =  oValidater[sParaName].sTipInfo;
                                                        $( oValidater[sParaName].sTipLocation ).text( oValidater[sParaName].sTipInfo );
                                                }
                                                else {
                                                        $( oValidater[sParaName].sTipLocation ).text( '' );
                                                }
                                                break;
                                }
                        }
                }
                return oValidateResult;
        }
}
