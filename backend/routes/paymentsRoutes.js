const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarStatusPix } = require('../controllers/paymentsController');


const {
  gerarPix,
  pagarCartao,
  webhook,
} = require('../controllers/paymentsController');

// Gera QR Code / Copia & Cola PIX
router.post('/payments/pix', auth, gerarPix);

// Pagamento via cartão (mock)
router.post('/payments/charge', auth, pagarCartao);

// Webhook do Mercado Pago (sem auth!)
router.post('/webhooks/mercadopago', express.json({ type: '*/*' }), webhook);

router.get('/payments/status/:payment_ref', auth, verificarStatusPix);
module.exports = router;
