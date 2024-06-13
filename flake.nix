{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";

    nixpkgs.follows = "nixpkgs-matrix-private/nixpkgs";
    nixpkgs-matrix-private = {
      type = "github";
      host = "github.com";
      owner = "MatrixAI";
      repo = "nixpkgs-matrix-private";
    };
 };

  outputs = inputs@{ self, nixpkgs, flake-utils, ... }:
    let
      overlays = [
        inputs.nixpkgs-matrix-private.overlays.default
      ];
    in
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
        overlays = overlays;
      };

      shell = { ci ? false }: with pkgs; mkShell {
        nativeBuildInputs = [
          nodejs
          shellcheck
          git-lfs
        ];
        shellHook = ''
          echo "Entering $(npm pkg get name)"
          set -o allexport
          . ./.env
          set +o allexport
          set -v
          ${
            lib.optionalString ci
            ''
            set -o errexit
            set -o nounset
            set -o pipefail
            shopt -s inherit_errexit
            ''
          }
          mkdir --parents "$(pwd)/tmp"

          export PATH="$(pwd)/dist/bin:$(npm root)/.bin:$PATH"

          npm install --ignore-scripts

          set +v
        '';
      };
    in
    {
      devShells = {
        default = shell { ci = false; };
        ci = shell { ci = true; };
      };
    });
}
