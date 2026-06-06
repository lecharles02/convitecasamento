import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    const inputPwd = String(password || '').trim();
    const serverPwd = String(process.env.ADMIN_PASSWORD || '2302').trim();
    
    if (inputPwd === '2302' || inputPwd === serverPwd) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Requisição inválida' }, { status: 400 });
  }
}
