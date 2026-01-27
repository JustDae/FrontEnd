import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button, Breadcrumbs,
  Link, Stack, Card, CardContent, InputAdornment, Skeleton, Container,
  Grid, Zoom, Divider, Tooltip, Chip
} from "@mui/material";
import { Search, Edit, Delete, NavigateNext, Add, Payment, Clear } from "@mui/icons-material";
import api from "../services/api";
import { useUi } from "../context/UiContext";
import MetodoPagoFormDialog from "../components/metodoPago/MetodoPagoFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useNavigate } from "
