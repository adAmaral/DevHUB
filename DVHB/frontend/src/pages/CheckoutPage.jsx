import { useMemo, useState } from 'react';
import Seo from '../seo/Seo';
import { useCart } from '../context/CartContext';
import { createCheckout, finalizeOrder } from '../services/checkoutService';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CreditCardForm from '../components/checkout/CreditCardForm';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import SecurityInfo from '../components/checkout/SecurityInfo';
import EmptyCartState from '../components/checkout/EmptyCartState';
import CheckoutLoadingState from '../components/checkout/CheckoutLoadingState';
import ErrorState from '../components/ErrorState';

export default function CheckoutPage() {
  const { items, loading, error, subtotal, discount, total, applyCoupon, loadCart } = useCart();
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const errors = useMemo(() => ({
    name: !form.name.trim(),
    number: form.number.replace(/\s/g, '').length !== 16,
    expiry: !/^\d{2}\/\d{2}$/.test(form.expiry),
    cvv: form.cvv.length < 3,
  }), [form]);

  const cardValid = !Object.values(errors).some(Boolean);
  const canSubmit = items.length > 0 && (method !== 'card' || cardValid) && !status.loading;

  const handleSubmit = async () => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      const checkout = await createCheckout({ items, method });
      await finalizeOrder({ checkoutId: checkout.id, payment: method === 'card' ? form : { method }, total });
      setStatus({ loading: false, error: '', success: 'Pagamento enviado com sucesso. Aguarde a confirmação do pedido.' });
    } catch (e) {
      setStatus({ loading: false, error: e.message || 'Não foi possível concluir a compra.', success: '' });
    }
  };

  return <section>
    <Seo title='Checkout | DEVHUB' description='Finalize sua compra com segurança no DEVHUB.' path='/checkout' />
    <h1>Checkout e pagamento</h1>
    <CheckoutStepper />
    {loading && <CheckoutLoadingState />}
    {!loading && error && <ErrorState message={error} retry={<button className='btn btn-secondary' onClick={loadCart}>Tentar novamente</button>} />}
    {!loading && !error && items.length === 0 && <EmptyCartState />}
    {!loading && !error && items.length > 0 && <div className='checkout-grid'>
      <article className='card'>
        <h2>Pagamento</h2>
        <p className='muted'>Selecione o método e valide as informações para concluir.</p>
        <PaymentMethodSelector value={method} onChange={setMethod} />
        {method === 'card' ? <CreditCardForm form={form} setForm={setForm} errors={errors} /> : <p className='muted'>As instruções serão geradas após o envio do pedido.</p>}
        {status.error ? <p className='msg err'>{status.error}</p> : null}
        {status.success ? <p className='msg ok'>{status.success}</p> : null}
        <button className='btn btn-primary' onClick={handleSubmit} disabled={!canSubmit}>{status.loading ? 'Processando...' : 'Concluir compra'}</button>
        <SecurityInfo />
      </article>
      <CheckoutSummary items={items} subtotal={subtotal} discount={discount} total={total} onApplyCoupon={applyCoupon} />
    </div>}
  </section>;
}
