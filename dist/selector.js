"use strict";
function buildSelector(metricName, labels) {
    const allowedKeys = new Set([
        "__name__", "monitored_resource", "location",
        "cluster", "namespace_name", "pod_name", "container_name",
    ]);
    const merged = { "__name__": metricName, ...(labels ?? {}) };
    const parts = Object.entries(merged)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .filter(([k]) => allowedKeys.has(k))
        .map(([k, v]) => `"${k}"="${String(v).replaceAll('"', '"')}"`);
    return `{${parts.join(",")}}`;
}
