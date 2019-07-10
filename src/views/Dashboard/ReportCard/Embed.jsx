import React, { useRef, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import ReportContainer from "../../../containers/Report.container";

const SERVER_URL = process.env.REACT_APP_EMBED_SERVER_URL;

const EmbedDialog = ({ instanceId }) => {
  const textAreaRef = useRef(null);
  const [state, setState] = useState({
    width: 800,
    height: 450,
    responsive: false,
    hash: "",
    loading: false,
    error: ""
  });

  useEffect(() => {
    async function fetchHashCode(instanceId) {
      setState({ ...state, loading: true, error: "" });
      try {
        const hash = await ReportContainer.getHashCode(instanceId);
        setState({ ...state, hash, loading: false });
      } catch (error) {
        setState({
          ...state,
          error: "خطا در براقراری ارتباط با سرور",
          loading: false
        });
      }
    }

    fetchHashCode(instanceId);
  }, []);

  const copyToClipboard = e => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
  };

  const handleChange = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value
    });
  };

  const toggleResponsive = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.checked
    });
  };

  const embedText = `
<iframe src="${SERVER_URL}?id=${instanceId}&hash=${state.hash}&width=${
    state.width
  }&height=${state.height}&responsive=${
    state.responsive
  }" style="width: 100%; height: 100%; display: block; border: none"></iframe>`;

  if (state.loading) {
    return <Loading />;
  }

  if (state.error) {
    return <Error message={state.error} />;
  }

  return (
    <Grid container spacing={8}>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <TextField
          name="width"
          type="number"
          value={state.width}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <TextField
          name="height"
          type="number"
          value={state.height}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControlLabel
          control={
            <Checkbox
              name="responsive"
              checked={state.responsive}
              onChange={toggleResponsive}
              value={`${state.responsive}`}
            />
          }
          label="واکنش گرا"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <div style={{ direction: "ltr" }}>
          <textarea
            ref={textAreaRef}
            value={embedText}
            readOnly
            rows="8"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: "#eee"
            }}
          />
        </div>
      </Grid>
      <Grid item>
        <Button onClick={copyToClipboard} color="primary">
          ذخیره در کلیپ بورد
        </Button>
      </Grid>
    </Grid>
  );
};

export default EmbedDialog;
