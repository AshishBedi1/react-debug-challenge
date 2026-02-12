import React from 'react'

function withWidgetAuth(WrappedComponent) {
  const WithAuth = React.forwardRef(function WithAuth(props, ref) {
    const isAuthorized = true

    if (!isAuthorized) {
      return <div className="widget-unauthorized">Not authorized to view this widget</div>
    }

    return <WrappedComponent ref={ref} {...props} />
  })

  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithAuth
}

export default withWidgetAuth
