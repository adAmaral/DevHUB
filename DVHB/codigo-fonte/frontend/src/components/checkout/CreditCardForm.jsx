const maskCard=v=>v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
const maskDate=v=>v.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d{1,2})/,'$1/$2');
const maskCvv=v=>v.replace(/\D/g,'').slice(0,4);
export default function CreditCardForm({form,setForm,errors}){const u=(k,v)=>setForm(s=>({...s,[k]:v}));return <div className='grid two'>
<label>Nome no cartão<input className={`input ${errors.name?'input-err':''}`} value={form.name} onChange={e=>u('name',e.target.value)} /></label>
<label>Número do cartão<input className={`input ${errors.number?'input-err':''}`} value={form.number} onChange={e=>u('number',maskCard(e.target.value))} placeholder='0000 0000 0000 0000'/></label>
<label>Validade<input className={`input ${errors.expiry?'input-err':''}`} value={form.expiry} onChange={e=>u('expiry',maskDate(e.target.value))} placeholder='MM/AA'/></label>
<label>CVV<input className={`input ${errors.cvv?'input-err':''}`} value={form.cvv} onChange={e=>u('cvv',maskCvv(e.target.value))} placeholder='123'/></label>
</div>}
