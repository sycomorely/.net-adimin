using System;
using System.ComponentModel.DataAnnotations;

namespace Model.Dto.Menus
{
    public class MenuUpdateDto
    {
        /// <summary>
        /// 菜单ID
        /// </summary>
        [Required(ErrorMessage = "菜单ID不能为空")]
        public int Id { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [Required(ErrorMessage = "菜单名称不能为空")]
        public string Name { get; set; }

        /// <summary>
        /// 路由地址
        /// </summary>
        [Required(ErrorMessage = "路由地址不能为空")]
        public string Index { get; set; }

        /// <summary>
        /// 项目中的页面路径
        /// </summary>
        [Required(ErrorMessage = "页面路径不能为空")]
        public string FilePath { get; set; }

        /// <summary>
        /// 父级
        /// </summary>
        [Required(ErrorMessage = "父级ID不能为空")]
        public string ParentId { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// 是否启用（0=未启用，1=启用）
        /// </summary>
        public bool IsEnable { get; set; }

        /// <summary>
        /// 图标
        /// </summary>
        [Required(ErrorMessage = "图标不能为空")]
        public string Icon { get; set; }
    }
} 