import React from "react";
import { Box, Paper, Typography, Button, TextField, FormControl, MenuItem, Select, InputLabel, styled, SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const StyledForm = styled(Form)({
    display: "flex", 
    flexDirection: "column", 
    gap: "16px", 
    marginTop: "10px", 
    alignItems: "center",
  });

const NewTask: React.FC = () => {
    const { access_token } = useAuth();
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();

    if (!user?.is_admin) {
        navigate("/index/unauthorized", { replace: true });
        return null; 
      }

    return (
        <>
        <Box
        sx={{
            display: 'flex',
            margin:"auto",
            justifyContent: "center",
            alignItems: "center", 
        }}
        >
            <Paper elevation={10} sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: "30%",
                justifyContent: "center",
                alignItems: "center",
                padding: '16px',
                marginBottom: "20px"
            }}>
                  <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        status: "Completed",
                        priority: "High",
                        start_date: "",
                        end_date: "",
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .required("This field is required"),
                        description: Yup.string()
                        .required("This field is required"),
                        status: Yup.string()
                        .required("This field is required"),
                        priority: Yup.string()
                        .required("This field is required"),
                        start_date: Yup.date()
                        .required("This field is required"),
                        end_date: Yup.date()
                        .required("This field is required"),
                    })}
                    onSubmit={(values) => {
                        const createTask = async () => {
                            try {
                              const newPayload = {
                                name: values.name,
                                description: values.description,
                                status: values.status,
                                priority: values.priority,
                                start_date: values.start_date,
                                end_date: values.end_date,
                              };
                          
                              await axios.post(`http://laravel.test/api/tasks`, newPayload, {
                                  headers: {
                                    Authorization: `Bearer ${access_token}`,
                                  },
                                }
                              );

                              navigate("/index");
                            } catch (error) {
                              console.error("Error updating task:", error);
                            }
                        };
                        createTask();
                    }}
                    >
                    {({setFieldValue, values, errors, handleBlur, touched}) => (
                        <StyledForm>
                            <Typography variant="h3"><strong>Create task</strong></Typography>
                            <TextField
                                label="Name"
                                name="name"
                                required
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("name", e.target.value);  
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.name && touched.name)}
                            />
                            {errors.name && touched.name && (<Typography variant="body1" color="error" sx={{ alignSelf: "flex-start" }}>{errors.name}</Typography>)}
                            <TextField
                                label="Description"
                                name="description"
                                required
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("description", e.target.value)           
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.description && touched.description)}
                            />
                            {errors.description && touched.description && (<Typography variant="body1" color="error" sx={{ alignSelf: "flex-start" }}>{errors.description}</Typography>)}
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                label="Status"                    
                                name="status"
                                value={values.status}
                                onChange={(event: SelectChangeEvent<string>) => {
                                    setFieldValue("status", event.target.value)
                                }}
                                >
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                label="Priority"                    
                                name="priority"
                                value={values.priority}
                                onChange={(event: SelectChangeEvent<string>) => {
                                    setFieldValue("priority", event.target.value)
                                }}
                                >
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Start Date"
                                name="start_date"
                                type="date"
                                required
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("start_date", e.target.value)           
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.start_date && touched.start_date)}
                            />
                            {errors.start_date && touched.start_date && (<Typography variant="body1" color="error" sx={{ alignSelf: "flex-start" }}>{errors.start_date}</Typography>)}
                            <TextField
                                label="End Date"
                                name="end_date"
                                type="date"
                                required
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("end_date", e.target.value)           
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.end_date && touched.end_date)}
                            />
                            {errors.end_date && touched.end_date && (<Typography variant="body1" color="error" sx={{ alignSelf: "flex-start" }}>{errors.end_date}</Typography>)}
                            <Box sx={{ 
                                display: "flex", 
                                gap: "10px", 
                                width: '100%' 
                                }}>
                                <Button variant="contained" color="primary" type="submit">
                                Save
                                </Button>
                                <Button variant="outlined" onClick={() => navigate("/index")}>
                                Cancel
                                </Button>
                            </Box>
                        </StyledForm>)}
                    </Formik>
            </Paper>
        </Box>
        </>
    );
};

export default NewTask;
