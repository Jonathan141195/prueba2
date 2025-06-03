/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { isEmpty, isNil, isPlainObject } from "lodash";
import { Autocomplete, TextField } from "@mui/material";
import ServicioService from "../../services/ServicioService";

export const BodegaAutoComplete = ({
  errors,
  field,
  setBodegaSeleccionada,
  disabled = false,
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [bodegas, setBodegas] = useState([]);
  const [selectedBodega, setSelectedBodega] = useState(null);
  useEffect(() => {
    BodegaService.getBodegaByUsuario()
      .then((response) => {
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  useEffect(() => {
    if (!isNil(data)) {
      setBodegas(
        data.map((element) => {
          return {
            label: `${element.id}-${element.nombre}`,
            bodegaId: element.id,
          };
        })
      );
    }
  }, [data]);

  const getOptionLabel = (data) => {
    if (data == "") {
      return "";
    }
    if (isEmpty(bodegas)) {
      return data;
    }
    if (isPlainObject(data)) {
      return data.label;
    }

    const bodegaEdited = bodegas.find((e) => e.bodegaId == data);
    return bodegaEdited.label;
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Autocomplete
      onChange={(e, element) => {
        setSelectedBodega(element);
        setBodegaSeleccionada(element.bodegaId);
        field.onChange(element.bodegaId);
      }}
      id="bodegaAutoComplete"
      options={bodegas}
      defaultValue={field.value}
      value={isEmpty(field.value) ? null : field.value}
      disabled={disabled}
      getOptionLabel={(option) => getOptionLabel(option)}
      isOptionEqualToValue={(option, newValue) => {
        if (isPlainObject(newValue)) {
          return option.bodegaId == newValue.bodegaId;
        }
        return option.bodegaId == newValue;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Bodega"
          error={Boolean(errors.bodegaId)}
          helperText={errors.bodegaId ? errors.bodegaId.message : ""}
        />
      )}
    />
  );
};
