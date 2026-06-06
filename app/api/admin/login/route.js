import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Requisição inválida' }, { status: 400 });
  }
}
