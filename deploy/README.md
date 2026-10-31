# deploy/

Workload manifests for the site: the `wshno` Deployment and Service. On every release, the
`manifests` job in `.github/workflows/container.yml` runs the `manifests` action from
hwinther/reusable-workflows, which:

1. renders this directory, with the image pinned to `tag@digest`;
2. validates the output with kubeconform;
3. pushes it as an OCI artifact to `ghcr.io/wshno/wshno/manifests:<version>`;
4. signs it with cosign (keyless).

On pull requests, `manifest-diff.yml` posts the rendered diff against the base branch as a PR
comment. PRs labelled `deploy-feature` also get `manifests:pr-<N>` from `pr-e2e.yml`: the same
manifests, pinned to the PR image and signed by that workflow. Don't commit rendered output.

The cluster repo (hwinther/proxmox) consumes the artifact through a Flux `OCIRepository` and
`Kustomization`. It provides everything that isn't in here:

- the namespace (via `targetNamespace`) and network policies;
- the **Ingress**. It isn't part of this artifact because it is mostly cluster routing: it serves
  `wsh.no` and `www.wsh.no`, sends `/api/<game>` to the game-status services that run in the
  cluster (the Status page reads them same-origin), and carries the homepage tile. It routes `/`
  to `Service/wshno` port 8080.

## Contract

### Variables

None. CI fails if the rendered output contains a variable without a default, unless it is
documented here.

### Resource names

`Deployment/wshno` and `Service/wshno` (port `8080`, named `http`). The cluster's Ingress and the
`app: wshno` network policy selector depend on them, and Flux prunes anything that disappears from
the artifact, so rename deliberately.

## Render locally

`kubectl kustomize deploy` shows the manifests. With the contract check and kubeconform, as CI
runs them, use the action's script from a hwinther/reusable-workflows checkout (needs kubectl and
kubeconform on `PATH`):

```bash
RENDERS='wshno.yaml=deploy' \
  bash ../reusable-workflows/.github/actions/manifests/scripts/render-all.sh . /tmp/manifests /tmp/renders.txt validate
```
