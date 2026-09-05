import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const GUMLOOP_API_KEY = process.env.GUMLOOP_API_KEY || '';
const GUMLOOP_USER_ID = process.env.GUMLOOP_USER_ID || '';
const GUMLOOP_USER_EMAIL = process.env.GUMLOOP_USER_EMAIL || 'najjar.nidhal@gmail.com';

export class GumloopEngine {
  constructor(apiKey = GUMLOOP_API_KEY, userId = GUMLOOP_USER_ID) {
    this.apiKey = apiKey;
    this.userId = userId;
    this.baseUrl = 'https://api.gumloop.com/api/v1';
  }

  /**
   * Start a Gumloop Pipeline run asynchronously
   * @param {string} pipelineId 
   * @param {object} inputs 
   */
  async startPipeline(pipelineId, inputs = {}) {
    if (!this.apiKey) {
      console.warn('⚠️ [Gumloop] Aucune clé GUMLOOP_API_KEY trouvée dans .env.local. Simulation active.');
      return {
        run_id: `sim_run_${Date.now()}`,
        status: 'RUNNING',
        message: 'Pipeline lancé en mode simulation local.'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/start_pipeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          user_id: this.userId,
          saved_item_id: pipelineId,
          pipeline_inputs: inputs
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error starting Gumloop pipeline:', error);
      throw error;
    }
  }

  /**
   * Check status and retrieve output of a Gumloop run
   * @param {string} runId 
   */
  async getRunResult(runId) {
    if (runId.startsWith('sim_run_')) {
      return {
        status: 'COMPLETED',
        outputs: {
          score: 85,
          status: 'EXCELLENT',
          dmarc_valid: true,
          spf_valid: true,
          ai_recommendation: 'Configuration optimale. Aucun spambox détecté.'
        }
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get_pl_run?run_id=${runId}&user_id=${this.userId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching Gumloop run result:', error);
      throw error;
    }
  }

  /**
   * Trigger InboxGuard DNS Audit via Gumloop
   */
  async runInboxGuardScan(domain, email = GUMLOOP_USER_EMAIL) {
    console.log(`🛡️ [Gumloop -> InboxGuard] Lancement scan pour ${domain}...`);
    return this.startPipeline(process.env.GUMLOOP_PIPELINE_INBOXGUARD || 'pipe_inboxguard_v1', {
      target_domain: domain,
      recipient_email: email,
      action: 'FULL_AUDIT'
    });
  }

  /**
   * Trigger Winnow Cloud Log Optimization via Gumloop
   */
  async runWinnowOptimization(logVolumeGB, cloudProvider = 'Datadog') {
    console.log(`⚡ [Gumloop -> Winnow] Analyse d'économie télémétrie pour ${logVolumeGB} GB...`);
    return this.startPipeline(process.env.GUMLOOP_PIPELINE_WINNOW || 'pipe_winnow_v1', {
      log_volume_gb: logVolumeGB,
      provider: cloudProvider,
      target_email: GUMLOOP_USER_EMAIL
    });
  }

  /**
   * Trigger Revenue Rescue Churn Recovery via Gumloop
   */
  async runRevenueRescue(customerName, amountFCFA, paymentProvider = 'Stripe') {
    console.log(`💳 [Gumloop -> Revenue Rescue] Relance automatique pour ${customerName} (${amountFCFA} FCFA)...`);
    return this.startPipeline(process.env.GUMLOOP_PIPELINE_REVENUE_RESCUE || 'pipe_revenue_rescue_v1', {
      customer_name: customerName,
      amount: amountFCFA,
      provider: paymentProvider,
      whatsapp_alert: true
    });
  }
}

// Quick Test if run directly
if (process.argv[1].endsWith('gumloop-client.mjs')) {
  const engine = new GumloopEngine();
  console.log(`🚀 Gumloop Engine initialisé pour le compte: ${GUMLOOP_USER_EMAIL}`);
  engine.runInboxGuardScan('2sconstruction.ci').then(res => {
    console.log('Résultat initialisation:', res);
  });
}
