export default function Button({variant='primary',...props}){return <button {...props} className={`btn btn-${variant} ${props.className||''}`.trim()} />}
