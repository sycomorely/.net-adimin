using System;
using System.ComponentModel.DataAnnotations;

namespace Model.Dto.Roles
{
    public class RoleUpdateDto
    {
        /// <summary>
        /// 角色ID
        /// </summary>
        [Required(ErrorMessage = "角色ID不能为空")]
        public int Id { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [Required(ErrorMessage = "角色名称不能为空")]
        public string Name { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// 是否启用（0=未启用，1=启用）
        /// </summary>
        public bool IsEnable { get; set; }
    }
} 