defmodule ComponentsAPI.MixProject do
  use Mix.Project

  def project do
    [
      app: :components_api,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:ex_component_schema,
       git: "https://github.com/lenra-io/ex_component_schema", ref: "v1.0.0-beta.2"},
      {:jason, "~> 1.2"}
    ]
  end
end
