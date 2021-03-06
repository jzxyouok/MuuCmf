<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: yangweijie <yangweijiester@gmail.com> <code-tech.diandian.com>
// +----------------------------------------------------------------------

namespace Admin\Model;
use Think\Model;

/**
 * 插件模型
 * @author yangweijie <yangweijiester@gmail.com>
 */

class MenuModel extends Model {

	protected $_validate = array(
		array('url','require','url必须填写'), //默认情况下用正则进行验证
	);

	//获取树的根到子节点的路径
	public function getPath($id){
		$path = array();
		$nav = $this->where("id='{$id}'")->field('id,pid,title')->find();
		$path[] = $nav;
		if($nav['pid'] !='0'){
			$path = array_merge($this->getPath($nav['pid']),$path);
		}
		return $path;
	}

    /**
     * 写入、编辑方法
     * @param  Array 写入数据的数组
     * @return 写入数据库中的主键ID
     */
	public function editData($data)
    {
        if($data['id']){
            $res=$this->save($data);
        }else{
            $data['id']= create_guid();
            $res=$this->add($data);
        }
        return $res;
    }
}

