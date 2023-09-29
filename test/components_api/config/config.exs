import Config

# Configure JSON validator
config :ex_component_schema,
       :remote_schema_resolver,
       {ComponentsAPI.JsonSchemata, :read_schema}
