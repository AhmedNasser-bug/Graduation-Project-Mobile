# NephroEdge — Offline-First Bedside Mobile App (`Graduation-Project-Mobile`)

> **Master Documentation & Quick Dev Setup Hub:**  
> 👉 **[xByteA/Graduation-Project-Documentation](https://github.com/xByteA/Graduation-Project-Documentation)** *(Contains `API_CONTRACTS_V1.md`, `OUT_OF_SCOPE_BACKLOG.md`, and the 5-repo architecture diagrams)*

---

## 1. Purpose & Prototype Scope

Offline-first Nurse & Bedside Tablet application synchronized with the clinic workstation backend ([`xByteA/Graduation-Project-Backend`](https://github.com/xByteA/Graduation-Project-Backend)):
* **Zero-Latency Active Shift Board:** Pulls `GET /api/v1/shift/active` (`vw_ActiveShiftSessionBoard`) displaying Bed #, Patient Name, MRN, Target Dry Weight, Pre-Weight, IDWG Fluid Gain, and Latest BP/HR/UF.
* **1-Tap Intradialytic Vitals & Local IDH Guard:** Pushes time-series vitals to `POST /api/v1/sessions/{sessionId}/telemetry` and immediately displays deterministic MIT MIMIC-IV / KDOQI IDH alerts ($\text{SBP} < 90\text{ mmHg}$ or $\Delta\text{SBP} \ge 20\text{ mmHg}$).
* **Transactional Outbox Sync:** Queues bedside mutations offline with SHA-256 integrity hashes and syncs via `POST /api/v1/sync/outbox-batch`.
