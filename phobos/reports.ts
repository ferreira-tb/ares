import { assert, assertType } from "#/error.js";
import { parseReportDate, assertWorldFromURL, assertCoordsFromTextContent } from "#/helpers.js";
import { ipcInvoke } from "#/ipc.js";
import type { FullDeimosReport } from '@/deimos.js';

export async function fetchPlunderReportsForDeimos(urls: string[]): Promise<Response> {
    assertType(Array.isArray(urls), 'A lista de URLs não é uma array.');
    assert(/\.?tribalwars/.test(location.hostname), 'Phobos não está na localização correta.');

    const parser = new DOMParser();
    const deimosReports: FullDeimosReport[] = [];
    
    for (const url of urls) {
        const urlObject = new URL(url);
        const id = urlObject.searchParams.assertAsInteger('view');

        const response = await fetch(urlObject.href);
        const text = await response.text();
        const report = parser.parseFromString(text, 'text/html').documentElement;

        // Mundo.
        const world = assertWorldFromURL(urlObject);

        // Informação dos exploradores sobre os recursos esperados para o próximo ataque.
        const resourcesFields = report.queryAsArray('#attack_spy_resources .res-icons-separated > .nowrap > .res');
        if (resourcesFields.length === 0) continue;
        const expected = resourcesFields.reduce((prev, curr) => prev + curr.parseInt(), 0);

        // Quantia saqueada e capacidade de carga do modelo atacante.
        const attackResults = report.queryAndAssert('#attack_results tr > td:last-of-type');
        const textContent = attackResults.assertTextContent();
        const [plundered, carry] = textContent.split('\/').map((item) => Number.assertInteger(item, 10));

        // Data do relatório e minutos desde o ataque.
        const time = parseReportDate(report, false);
        const minutes_since = Math.ceil((Date.now() - time) / 60000);

        // ID da aldeia atacante.
        const attackerField = report.queryAndAssert('#attack_info_att a[href*="screen=info_village"');
        const attackerText = attackerField.assertTextContent();
        const [origin_x, origin_y] = assertCoordsFromTextContent(attackerText);

        // ID da aldeia defensora.
        const defField = report.queryAndAssert('#attack_info_def a[href*="screen=info_village"');
        const defText = defField.assertTextContent();
        const [dest_x, dest_y] = assertCoordsFromTextContent(defText);

        const deimosReport: FullDeimosReport = {
            id,
            time,
            world,
            expected,
            carry,
            origin_x,
            origin_y,
            dest_x,
            dest_y,
            minutes_since,
            plundered
        };

        deimosReports.push(deimosReport);
    };
    
    const endpoint = await ipcInvoke('deimos-endpoint');
    return await fetch(`${endpoint}/plunder/save`, {
        method: 'post',
        body: JSON.stringify(deimosReports)
    });
};