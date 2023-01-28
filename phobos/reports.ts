import { assert, assertType } from "#/error.js";
import { parseReportDate } from "#/helpers.js";
import { DeimosReport } from '#/deimos.js';
import { ipcInvoke } from "#/ipc.js";

export async function fetchPlunderReportsForDeimos(urls: string[]): Promise<Response> {
    assertType(Array.isArray(urls), 'A lista de URLs não é uma array.');
    assert(location.hostname.includes('.tribalwars'), 'Phobos não está na localização correta.');

    const parser = new DOMParser();
    const deimosReports: DeimosReport[] = [];

    for (const url of urls) {
        const urlObject = new URL(url);
        const reportId = urlObject.searchParams.assertAsInteger('view');

        const response = await fetch(urlObject.href);
        const text = await response.text();
        const report = parser.parseFromString(text, 'text/html').documentElement;

        // Informação dos exploradores sobre os recursos esperados para o próximo ataque.
        const resourcesFields = report.queryAsArray('#attack_spy_resources .res-icons-separated > .nowrap > .res');
        if (resourcesFields.length === 0) continue;
        const expected = resourcesFields.reduce((prev, curr) => prev + curr.parseInt(), 0);

        // Quantia saqueada e capacidade de carga do modelo atacante.
        const attackResults = report.queryAndAssert('#attack_results tr > td:last-of-type');
        const textContent = attackResults.assertTextContent();
        const [plundered, carry] = textContent.split('\/').map((item) => Number.assertInteger(item, 10));

        // Minutos desde o ataque.
        const minutes = Math.ceil((Date.now() - parseReportDate(report)) / 60000);

        // ID da aldeia atacante.
        const attackerField = report.queryAndAssert('#attack_info_att a[href*="screen=info_village"');
        const attackerUrl = new URL(location.origin + attackerField.assertAttribute('href'));
        const attackId = attackerUrl.searchParams.assertAsInteger('id');

        // ID da aldeia defensora.
        const defField = report.queryAndAssert('#attack_info_def a[href*="screen=info_village"');
        const defUrl = new URL(location.origin + defField.assertAttribute('href'));
        const defId = defUrl.searchParams.assertAsInteger('id');

        const deimosReport = new DeimosReport(reportId, expected, carry, attackId, defId, minutes, plundered);
        deimosReports.push(deimosReport);
    };

    const index = location.hostname.indexOf('.tribalwars');
    const world = location.hostname.slice(0, index).replace(/www\.?/g, '');
    const port = await ipcInvoke('deimos-port');

    return await fetch(`http://127.0.0.1:${port}/deimos/save/plunder/${world}`, {
        method: 'post',
        body: JSON.stringify(deimosReports)
    });
};