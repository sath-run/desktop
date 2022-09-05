import { createFromIconfontCN } from '@ant-design/icons'
import * as React from "react";
const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/c/font_3520626_nqkm5khxauj.js'
})

// Icon组件

interface XIconProps {
  name: string
  color?: string
  size?: number
  className?: string
  style?: React.CSSProperties
  onClick?: (e:any) =>  void
}

const XIcon: React.FC<XIconProps> = (props, restProps) => {
  const { name, color, size, className, style, onClick } = props;
  if(!name){
    return null;
  }
  return (
    <IconFont
      type={/^icon-/.test(name) ? name : `icon-${name}`}
      className={className}
      style={{ ...style, color, fontSize: size }}
      onClick={onClick}
      {...restProps}
    />
  )
}

export default XIcon
