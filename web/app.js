const ids = {
  execution: document.querySelector("#execution"),
  gap: document.querySelector("#gap"),
  artifact: document.querySelector("#artifact"),
  validation: document.querySelector("#validation"),
  publish: document.querySelector("#publish"),
  validated: document.querySelector("#validated"),
  record: document.querySelector("#record"),
  statusTitle: document.querySelector("#status-title"),
  statusCopy: document.querySelector("#status-copy"),
  registryLink: document.querySelector("#registry-link")
};

const state = await fetch("/api/state").then((response) => response.json());

const hasDemo = Boolean(state.trace && state.artifact && state.improvement);
ids.statusTitle.textContent = hasDemo ? "Demo artifacts loaded" : "Run npm run demo";
ids.statusCopy.textContent = hasDemo
  ? "OpenGap found the latest local provenance record."
  : "The UI reads .opengap artifacts after a CLI demo run.";

ids.execution.textContent = state.execution
  ? `${state.execution.failureKind}: ${state.execution.actualOutcome}`
  : "No execution report found.";
ids.gap.textContent = state.gap
  ? `${state.gap.title}. ${state.gap.reason}`
  : "No gap record found.";
ids.artifact.textContent = state.artifact
  ? `${state.artifact.type} ${state.artifact.artifactId} generated via ${state.artifact.computeProvider}.`
  : "No generated artifact found.";
ids.validation.textContent = state.validation
  ? `${state.validation.status} with exit code ${state.validation.exitCode}.`
  : "No validation found.";
ids.publish.textContent = state.improvement
  ? `Storage ${state.improvement.storageRoot}; tx ${state.improvement.registryTx}.`
  : "No publish record found.";
ids.validated.textContent = state.validated
  ? `${state.validated.artifactId} is indexed for future agents.`
  : "No validated artifact index found.";

ids.record.textContent = JSON.stringify(state.improvement ?? {}, null, 2);

if (state.improvement?.registryTx) {
  ids.registryLink.href = `https://chainscan-galileo.0g.ai/tx/${state.improvement.registryTx}`;
  ids.registryLink.textContent = state.improvement.registryTx;
}

document.querySelectorAll(".step").forEach((step) => {
  const key = step.getAttribute("data-key");
  const ready = key === "publish"
    ? state.improvement
    : key === "validated"
      ? state.validated
      : state[key];
  if (ready) step.classList.add("ready");
});

