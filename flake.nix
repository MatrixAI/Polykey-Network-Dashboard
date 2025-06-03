{
  inputs = {
    nixpkgs-matrix-private = {
      type = "indirect";
      id = "nixpkgs-matrix-private";
    };
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs-matrix-private, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs-matrix-private.legacyPackages.${system};

        shell = { ci ? false }:
          with pkgs;
          mkShell {
            nativeBuildInputs = [ nodejs_20 shellcheck git-lfs ];
            shellHook = ''
              echo "Entering $(npm pkg get name)"
              set -o allexport
              . <(polykey secrets env Polykey-Network-Dashboard)
              set +o allexport
              set -v
              ${lib.optionalString ci ''
                set -o errexit
                set -o nounset
                set -o pipefail
                shopt -s inherit_errexit
              ''}
              mkdir --parents "$(pwd)/tmp"

              export PATH="$(pwd)/dist/bin:$(npm root)/.bin:$PATH"

              npm install --ignore-scripts

              set +v
            '';
          };
      in {
        devShells = {
          default = shell { ci = false; };
          ci = shell { ci = true; };
        };
      });
}
