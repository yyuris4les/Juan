// services/emailService.js — envio de e-mails com Nodemailer

const nodemailer = require('nodemailer');

// ── Configuração do transporte ────────────────────────────
// Para produção, substitua pelas credenciais reais do seu servidor SMTP.
// Suporte para Gmail, Outlook, SendGrid, Mailgun, etc.
// Em desenvolvimento, use Ethereal (https://ethereal.email) para testar sem enviar de verdade.

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT)   || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true para porta 465
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

// ── Templates de e-mail ───────────────────────────────────

/**
 * Formata um valor de campo para exibição no e-mail.
 * Arrays (checkboxes) são transformados em lista legível.
 */
function formatValue(value) {
  if (!value || value === '') return '<em style="color:#999">Não informado</em>';
  if (Array.isArray(value))   return value.join(', ');
  return String(value);
}

/** Gera uma linha de detalhe para o e-mail admin */
function row(label, value) {
  return `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#8a8278;text-transform:uppercase;
                 letter-spacing:0.06em;width:200px;vertical-align:top;border-bottom:1px solid #2e2a24;">
        ${label}
      </td>
      <td style="padding:10px 16px;font-size:14px;color:#e8e0d4;
                 vertical-align:top;border-bottom:1px solid #2e2a24;">
        ${formatValue(value)}
      </td>
    </tr>`;
}

/** Template HTML do e-mail enviado ao admin/designer */
function templateAdmin(data) {
  const date = new Date(data.createdAt).toLocaleString('pt-BR');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f0e0c;font-family:'DM Sans',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0"
             style="background:#161410;border:1px solid #2e2a24;border-radius:10px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="padding:40px 48px 32px;border-bottom:1px solid #2e2a24;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;
                      color:#8a6f44;margin:0 0 12px;">Novo Briefing Recebido</p>
            <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:300;
                       color:#e8e0d4;margin:0 0 6px;letter-spacing:-0.01em;">
              ${data.nome}
            </h1>
            <p style="font-size:13px;color:#5a5550;margin:0;">${date}</p>
          </td>
        </tr>

        <!-- Seção 1: Contato -->
        <tr><td style="padding:32px 48px 0;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#c9a96e;
                    font-weight:400;margin:0 0 16px;">01 — Dados de Contato</p>
        </td></tr>
        <tr><td style="padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid #2e2a24;border-radius:6px;overflow:hidden;">
            ${row('E-mail',    data.email)}
            ${row('Telefone',  data.telefone)}
            ${row('Endereço',  data.endereco)}
          </table>
        </td></tr>

        <!-- Seção 2: Usuários -->
        <tr><td style="padding:32px 48px 0;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#c9a96e;
                    font-weight:400;margin:0 0 16px;">02 — Perfil dos Usuários</p>
        </td></tr>
        <tr><td style="padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid #2e2a24;border-radius:6px;overflow:hidden;">
            ${row('Pessoas',        data.num_pessoas)}
            ${row('Idades',         data.idades)}
            ${row('Crianças',       data.criancas)}
            ${row('Pets',           data.pets)}
            ${row('Quais pets',     data.pets_quais)}
            ${row('Rotina',         data.rotina)}
            ${row('Acessibilidade', data.acessibilidade)}
          </table>
        </td></tr>

        <!-- Seção 3: Imóvel -->
        <tr><td style="padding:32px 48px 0;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#c9a96e;
                    font-weight:400;margin:0 0 16px;">03 — Imóvel</p>
        </td></tr>
        <tr><td style="padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid #2e2a24;border-radius:6px;overflow:hidden;">
            ${row('Tipo',        data.tipo_imovel)}
            ${row('Propriedade', data.propriedade)}
          </table>
        </td></tr>

        <!-- Seção 4: Objetivos -->
        <tr><td style="padding:32px 48px 0;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#c9a96e;
                    font-weight:400;margin:0 0 16px;">04 — Objetivos e Estilo</p>
        </td></tr>
        <tr><td style="padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid #2e2a24;border-radius:6px;overflow:hidden;">
            ${row('Objetivos',        data.objetivo)}
            ${row('Outro objetivo',   data.objetivo_outro)}
            ${row('Transformar',      data.transformar)}
            ${row('Estilo',           data.estilo)}
            ${row('Referências',      data.referencias)}
            ${row('Não gosta',        data.nao_gosta)}
            ${row('Cores (gosta)',    data.cores_gosta)}
            ${row('Cores (não gosta)',data.cores_nao_gosta)}
            ${row('Materiais',        data.materiais)}
            ${row('Resultado ideal',  data.resultado_ideal)}
          </table>
        </td></tr>

        <!-- Seção 5: Mobiliário -->
        <tr><td style="padding:32px 48px 0;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#c9a96e;
                    font-weight:400;margin:0 0 16px;">05 — Mobiliário</p>
        </td></tr>
        <tr><td style="padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid #2e2a24;border-radius:6px;overflow:hidden;">
            ${row('Manter móveis',     data.moveis_manter)}
            ${row('Móveis planejados', data.moveis_planejados)}
            ${row('Eletrodomésticos',  data.eletrodomesticos)}
          </table>
        </td></tr>

        <!-- Seção 6: Iluminação -->
        <tr><td style="padding:32px 48px 0;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#c9a96e;
                    font-weight:400;margin:0 0 16px;">06 — Iluminação</p>
        </td></tr>
        <tr><td style="padding:0 32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid #2e2a24;border-radius:6px;overflow:hidden;">
            ${row('Tipo de luz',          data.iluminacao_tipo)}
            ${row('Iluminação específica', data.iluminacao_especifica)}
          </table>
        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;border-top:1px solid #2e2a24;text-align:center;">
            <p style="font-size:12px;color:#5a5550;margin:0;">
              ✦ Studio Briefing — Design de Interiores &nbsp;|&nbsp; ID: ${data.id}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

/** Template HTML do e-mail de confirmação enviado ao cliente */
function templateCliente(data) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f0e0c;font-family:'DM Sans',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0"
             style="background:#161410;border:1px solid #2e2a24;border-radius:10px;overflow:hidden;">

        <!-- Header decorativo -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e1b17,#2a2520);
                     padding:48px;text-align:center;border-bottom:1px solid #2e2a24;">
            <p style="font-size:28px;margin:0 0 16px;color:#c9a96e;">✦</p>
            <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:300;
                       color:#e8e0d4;margin:0 0 8px;letter-spacing:-0.01em;">
              Recebemos seu briefing!
            </h1>
            <p style="font-size:14px;color:#8a8278;margin:0;">
              Obrigado, <strong style="color:#c9a96e;">${data.nome.split(' ')[0]}</strong>.
              Em breve entraremos em contato.
            </p>
          </td>
        </tr>

        <!-- Corpo -->
        <tr>
          <td style="padding:40px 48px;">
            <p style="font-size:15px;color:#8a8278;line-height:1.7;margin:0 0 24px;">
              Suas respostas foram registradas com sucesso e nossa equipe já está
              analisando o seu projeto. Assim que tivermos uma proposta inicial,
              você receberá um retorno pelo e-mail ou WhatsApp informados.
            </p>

            <!-- Resumo -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#1e1b17;border:1px solid #2e2a24;
                          border-radius:6px;padding:0;margin-bottom:32px;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #2e2a24;">
                  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
                             color:#8a6f44;margin:0 0 4px;">Resumo do seu briefing</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;border-bottom:1px solid #2e2a24;">
                  <span style="font-size:12px;color:#5a5550;text-transform:uppercase;
                               letter-spacing:0.06em;">Tipo de imóvel</span><br/>
                  <span style="font-size:14px;color:#e8e0d4;">${formatValue(data.tipo_imovel)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;border-bottom:1px solid #2e2a24;">
                  <span style="font-size:12px;color:#5a5550;text-transform:uppercase;
                               letter-spacing:0.06em;">Estilo desejado</span><br/>
                  <span style="font-size:14px;color:#e8e0d4;">${formatValue(data.estilo)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;">
                  <span style="font-size:12px;color:#5a5550;text-transform:uppercase;
                               letter-spacing:0.06em;">Objetivos</span><br/>
                  <span style="font-size:14px;color:#e8e0d4;">${formatValue(data.objetivo)}</span>
                </td>
              </tr>
            </table>

            <p style="font-size:13px;color:#5a5550;text-align:center;margin:0;">
              Qualquer dúvida, responda este e-mail. ✦
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 48px;border-top:1px solid #2e2a24;text-align:center;">
            <p style="font-size:12px;color:#5a5550;margin:0;">
              Studio Briefing — Design de Interiores
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ── Funções públicas ──────────────────────────────────────

/**
 * Envia e-mail ao admin/designer com todos os dados do briefing.
 */
async function sendAdminEmail(data) {
  const transporter = createTransporter();
  const adminEmail  = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  await transporter.sendMail({
    from:    `"Studio Briefing" <${process.env.SMTP_USER}>`,
    to:      adminEmail,
    subject: `✦ Novo Briefing — ${data.nome}`,
    html:    templateAdmin(data),
  });

  console.log(`  → E-mail admin enviado para ${adminEmail}`);
}

/**
 * Envia e-mail de confirmação ao cliente.
 */
async function sendClientEmail(data) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from:    `"Studio Briefing" <${process.env.SMTP_USER}>`,
    to:      data.email,
    subject: `✦ Recebemos seu briefing, ${data.nome.split(' ')[0]}!`,
    html:    templateCliente(data),
  });

  console.log(`  → E-mail de confirmação enviado para ${data.email}`);
}

/**
 * Dispara os dois e-mails em paralelo.
 * Não lança erro — falha de e-mail não deve impedir o salvamento.
 */
async function sendBriefingEmails(data) {
  try {
    await Promise.all([
      sendAdminEmail(data),
      sendClientEmail(data),
    ]);
  } catch (err) {
    console.error('  ✗ Erro ao enviar e-mails:', err.message);
  }
}

module.exports = { sendBriefingEmails };
