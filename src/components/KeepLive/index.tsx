import React, {useRef, useEffect, useReducer, useMemo, memo, ReactElement} from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useLocation } from 'react-router-dom'

const KeepAlive:React.FC<{
    include: Array<string>;
    keys: {
        [key: string]: string
    };
    children: ReactElement | null
}> = props => {
    const { include, keys, children } = props
    const { pathname } = useLocation()
    const componentList = useRef<{[key: string]: React.ReactElement | null}>({})
    const forceUpdate = useReducer(bool => !bool, true)[1] // 强制渲染
    const cacheKey = useMemo(() => pathname + "__" + keys[pathname], [pathname, keys]);
    const activeKey = useRef('')
    useEffect(() => {
        Object.keys(componentList.current).forEach(key => {
            const _key = key.split("__")[0]
            if (!include.includes(_key) || (_key === pathname)) {
                delete componentList.current[key]
            }
        })
        activeKey.current = cacheKey
        if (!componentList.current[activeKey.current]) {
            componentList.current[activeKey.current] = children
        }
        forceUpdate()
    }, [cacheKey, include])

    return (
        <TransitionGroup component={ null }>
            {
                Object.keys(componentList.current).map(key =>
                    <CSSTransition
                        key={ key }
                        appear={ true }
                        timeout={ 500 }
                        classNames='fade'>
                        {
                            key === activeKey.current ?
                                <div
                                    className={
                                        `layout-container${include.includes(key.split("__")[0]) ? " keep-alive-fade": ""}`
                                    }>
                                    { componentList.current[key] }
                                </div> :
                                <div
                                    className='layout-container__keep-alive'
                                    style={{ display: 'none' }}>
                                    { componentList.current[key] }
                                </div>
                        }
                    </CSSTransition>
                )
            }
        </TransitionGroup>
    )
}

export default memo(KeepAlive)
