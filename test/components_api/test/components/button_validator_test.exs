defmodule ApplicationRunner.ButtonValidatorTest do
  use ExUnit.Case, async: true

  @moduledoc """
    Test the "button.schema.json" schema
  """

  test "valid button" do
    json = %{
      "type" => "button",
      "text" => "",
      "onPressed" => %{
        "action" => "anyaction",
        "props" => %{
          "number" => 10,
          "text" => "value"
        }
      }
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert :ok = ExComponentSchema.Validator.validate(schema, json)
  end

  test "valid button with no listener" do
    json = %{
      "type" => "button",
      "text" => "test"
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert :ok = ExComponentSchema.Validator.validate(schema, json)
  end

  test "invalid button type" do
    json = %{
      "type" => "buttons",
      "text" => "test"
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert {:error, [{"buttons is invalid. Should have been button", "#/type"}]} =
             ExComponentSchema.Validator.validate(schema, json)
  end

  test "invalid button with no value" do
    json = %{
      "type" => "button"
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert {:error, [{"Required property text was not present.", "#"}]} =
             ExComponentSchema.Validator.validate(schema, json)
  end

  test "invalid button with invalid action and props in listener" do
    json = %{
      "type" => "button",
      "text" => "test",
      "onPressed" => %{
        "action" => 10,
        "props" => ""
      }
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert {:error,
            [
              {"Type mismatch. Expected String but got Integer.", "#/onPressed/action"},
              {"Type mismatch. Expected Object but got String.", "#/onPressed/props"}
            ]} = ExComponentSchema.Validator.validate(schema, json)
  end

  test "invalid button with invalid listener key" do
    json = %{
      "type" => "button",
      "text" => "test",
      "onChange" => %{
        "action" => 42,
        "props" => "machin"
      }
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert {:error, [{"Schema does not allow additional properties.", "#/onChange"}]} =
             ExComponentSchema.Validator.validate(schema, json)
  end

  test "valid button with empty text" do
    json = %{
      "type" => "button",
      "text" => ""
    }

    schema = ComponentsAPI.JsonSchemata.load_schema("components/button.schema.json")

    assert :ok = ExComponentSchema.Validator.validate(schema, json)
  end
end
