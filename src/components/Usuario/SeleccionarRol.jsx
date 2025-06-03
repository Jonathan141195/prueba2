/* eslint-disable react/prop-types */
//import PropTypes from "prop-types";
import { isEmpty, isNil, isPlainObject } from "lodash";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import RolService from "../../services/RolService";



export function SeleccionarRol({
  value,
  onChange,
  setRolSelect,
}) {

  
  const [dataRol, setDataRol] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    RolService.getRoles()
      .then((response) => {
        setDataRol(response.data.results);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  useEffect(() => {
    if (!isNil(dataRol)) {
        setRoles(
        dataRol.map((element) => {
          return {
            label: `${element.id}-${element.tipo}`,
            rol: element,
          };
        })
      );
    }
  }, [dataRol]);

  const getOptionLabel = (data) => {
  
    if (data == "") {
      return "";
    }
    if (isEmpty(roles)) {
      return data;
    }
    if (isPlainObject(data)) {
      return data.label;
    }

    const rolEdited = roles.find((e) => e.rol.id == data);
    return rolEdited.label;
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Autocomplete
      onChange={(_, element) => {
        setRolSelect(element);
        onChange(element.rol.id);
      }}
      id="rolAutoComplete"
      options={roles}
      defaultValue={value}
      value={isEmpty(value) ? null : value}
      getOptionLabel={(data) => getOptionLabel(data)}
      isOptionEqualToValue={(option, newValue) => {
        
        
        return option.rol.id == newValue;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Rol"
          
        />
      )}
    />
  );
}
