import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { price, itemName, origin } = await request.json();

    if (!price || !itemName) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios ausentes: price e itemName.' },
        { status: 400 }
      );
    }

    const tag = process.env.INFINITEPAY_TAG;
    if (!tag) {
      return NextResponse.json(
        { success: false, error: 'InfinitePay Tag não configurada no servidor.' },
        { status: 500 }
      );
    }

    // Gerar um ID de pedido único (NSU) usando timestamp e random
    const orderNsu = `PED-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Converter valor para centavos
    const priceInCents = Math.round(parseFloat(price) * 100);

    // Endpoint oficial do Checkout da InfinitePay
    const url = 'https://api.checkout.infinitepay.io/links';

    const payload = {
      handle: tag,
      redirect_url: `${origin}/?payment=success`,
      webhook_url: `${origin}/api/webhook/infinitepay`, // Opcional, mantido como referência de webhook
      order_nsu: orderNsu,
      items: [
        {
          quantity: 1,
          price: priceInCents,
          description: String(itemName).substring(0, 100) // Truncado se for muito grande
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      console.error('InfinitePay error response:', data);
      return NextResponse.json(
        { success: false, error: 'Erro retornado pela API da InfinitePay.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, url: data.url });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao gerar o link de pagamento.' },
      { status: 500 }
    );
  }
}
