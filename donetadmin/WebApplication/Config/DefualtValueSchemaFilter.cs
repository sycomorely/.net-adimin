﻿using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.ComponentModel;
using System.Reflection;

namespace webapi.Config
{
    public class DefaultValueSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (schema == null) { return; }
            var objectSchema = schema;
            foreach (var property in objectSchema.Properties)
            {
                //按照数据的类型去指定默认值
                if (property.Value.Type == "string" && property.Value.Default == null)
                {
                    property.Value.Default = new OpenApiString("");
                }
                //按照字段名去指定默认值
                else if (property.Key == "pageIndex")
                {
                    property.Value.Example = new OpenApiInteger(1);
                }
                else if (property.Key == "pageSize")
                {
                    property.Value.Example = new OpenApiInteger(10);
                }
                //需要特性来实现
                DefaultValueAttribute defaultValueAttribute = context.ParameterInfo?.GetCustomAttribute<DefaultValueAttribute>();
                if (defaultValueAttribute != null)
                {
                    property.Value.Example = (IOpenApiAny)defaultValueAttribute.Value;
                }
            }
        }
    }
}
