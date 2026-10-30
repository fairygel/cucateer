
{
  description = "React Native Expo development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
          pnpm
          git
        ];

        shellHook = ''
          echo "Expo development environment"
          echo "Node: $(node --version)"
          echo "pnpm: $(pnpm --version)"
        '';
      };
    };
}

