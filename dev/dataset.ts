import { assert } from '@/error.js';
import { parseReportDate } from '$/helpers.js';
import { ipcSend } from '@/ipc.js';

/**
 * Recursos esperados para o próximo ataque, capacidade de carga,
 * ID da aldeia atacante, ID da aldeia defensora, minutos e recursos saqueados.
 */
export type CSVDataSet = [number, number, number, number, number, number];

/** Deve ser invocada apenas na janela de relatórios. */
export async function queryReportDataset() {
    const startTime = Date.now();

    const urls: string[] = [];
    const reportRows = document.queryAsArray('tr[class*="report"]:has(a.report-link[href*="report"])');

    for (const row of reportRows) {
        const reportAnchor = row.queryAndAssert('a.report-link[href*="report"]');
        const reportUrl = reportAnchor.assertAttribute('href');
        urls.push(reportUrl);
    };

    const dataset: CSVDataSet[] = [];

    for await (const report of fetchReports(urls)) {
        try {
            const resourcesFields = report.queryAsArray('#attack_spy_resources .res-icons-separated > .nowrap > .res');
            if (resourcesFields.length === 0) continue;

            const resources = resourcesFields.reduce((prev, curr) => prev + curr.parseInt(), 0);
    
            const attackResults = report.queryAndAssert('#attack_results tr > td:last-of-type');
            const textContent = attackResults.assertTextContent();
            const [plundered, carry] = textContent.split('\/').map((item) => Number.parseInt(item, 10));
    
            const minutes = (Date.now() - parseReportDate(report)) / 60000;
    
            const attackerField = report.queryAndAssert('#attack_info_att a[href*="screen=info_village"');
            const attackerUrl = new URL(location.origin + attackerField.assertAttribute('href'));
            const attackId = attackerUrl.searchParams.get('id');
            assert(typeof attackId === 'string', 'O ID da aldeia atacante não foi encontrado.');
    
            const defField = report.queryAndAssert('#attack_info_def a[href*="screen=info_village"');
            const defUrl = new URL(location.origin + defField.assertAttribute('href'));
            const defId = defUrl.searchParams.get('id');
            assert(typeof defId === 'string', 'O ID da aldeia defensora não foi encontrado.');
    
            const result: CSVDataSet = [
                resources,
                carry,
                Number.parseInt(attackId, 10),
                Number.parseInt(defId, 10),
                Math.ceil(minutes),
                plundered
            ]

            dataset.push(result);
            console.log(result);

        } catch (err) {
            console.error(err);
        };
    };

    ipcSend('dev-report-dataset', dataset);
    console.log(`Fim dos trabalhos. Tempo total: ${Date.now() - startTime}ms.`);
};

async function* fetchReports(urls: string[]) {
    const parser = new DOMParser();
    for (const url of urls) {
        const response = await fetch(url);
        const text = await response.text();
        yield parser.parseFromString(text, 'text/html').documentElement;
    };
};