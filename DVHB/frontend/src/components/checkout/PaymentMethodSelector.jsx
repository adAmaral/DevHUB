const methods=[{id:'card',label:'Cartão de crédito'},{id:'pix',label:'Pix'},{id:'boleto',label:'Boleto'}];
export default function PaymentMethodSelector({value,onChange}){return <div className='pay-methods'>{methods.map(m=><button type='button' key={m.id} className={`pay-pill ${value===m.id?'selected':''}`} onClick={()=>onChange(m.id)}>{m.label}</button>)}</div>}
