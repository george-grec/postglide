{
    inputs = {
        flake-utils.url = "github:numtide/flake-utils";
        nixpkgs.url = "nixpkgs/nixos-25.11";
        nix-gleam.url = "github:arnarg/nix-gleam";
    };
    outputs = { flake-utils, nix-gleam, nixpkgs, self }:
    flake-utils.lib.eachDefaultSystem (system: let 
        pkgs = import nixpkgs {
            inherit system;
            overlays = [ nix-gleam.overlays.default ];
        };

        defaultBuildInputs = with pkgs; [ bun erlang inotify-tools rebar3 ];
        in
        with pkgs;
        {
            packages.default = pkgs.buildGleamApplication {
                src = ./.;
            };
            devShell = mkShell {
                description = "gleam development environment";
                nativeBuildInputs = defaultBuildInputs 
                    ++ (with pkgs; [ gleam ]);
            };
        }
    );
}
