
function FormInput(props) {
  const { className, ...rest } = props
  return (
    <input
      className={className}
      {...rest}
    />
  )
}

export default FormInput
