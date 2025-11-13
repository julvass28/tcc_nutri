const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  gerarPix,
  webhook,
  verificarStatusPix,
} = require('../controllers/paymentsController');

// Gera QR Code / Copia & Cola PIX
router.post('/payments/pix', auth, gerarPix);

// Webhook do Mercado Pago (sem auth!)
router.post('/webhooks/mercadopago', express.json({ type: '*/*' }), webhook);

// Verifica status do pagamento PIX
router.get('/payments/status/:payment_ref', auth, verificarStatusPix);

module.exports = router;
