using System;
using System.ComponentModel.DataAnnotations;

namespace Model.Dto.Users
{
    public class UserUpdateDto
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        [Required(ErrorMessage = "用户ID不能为空")]
        public int Id { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        [Required(ErrorMessage = "用户名不能为空")]
        public string Name { get; set; }

        /// <summary>
        /// 昵称
        /// </summary>
        [Required(ErrorMessage = "昵称不能为空")]
        public string NickName { get; set; }

        /// <summary>
        /// 用户类型（0=超级管理员，1=普通用户）
        /// </summary>
        public int UserType { get; set; }

        /// <summary>
        /// 是否启用（0=未启用，1=启用）
        /// </summary>
        public bool IsEnable { get; set; }

        /// <summary>
        /// 头像
        /// </summary>
        public string Image { get; set; }
    }
} 