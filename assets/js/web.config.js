export const WEB_CONFIGURATION_METHODS = {
	API: {
		API_AUTHENTICATION: {
			METHODS: {
				AUTENTICAR: "ServicioEDOC"
			}
		},
		API_ADMINISTRATION: {
			METHODS: {
				OBT_TOTAL_CLIENTES: "ObtenerTotalClientes",
				OBT_TOTAL_PROVEEDORES: "ObtenerTotalProveedores",
				OBT_TOTAL_CORREOS_HOY: "ObtenerTotalCorreosHoy",
				OBT_MIS_RECURSOS: "ObtenerMisRecursos",
				OBT_CERTIFICADO_DIGITAL: "ObtenerCertificadoDigital",
				GUARDAR_CERTIFICADO_DIGITAL: "GuardarCertificadoDigital",
				OBT_COM_PORID_COM: "ObtenerComunicadoPorIdComunicado",
				OBT_COMS_PORID_DEST_POR_DEST: "ObtenerComunicadosPorIdTipoDestinatarioPorDestinatario",
				OBT_DGI: "ObtenerEstadoDGI",
				OBT_CONTACTO_ALERTA_COM: "ObtenerContactosAlertaComunicado",
				OBT_CLIENTES: "ObtenerClientes",
				OBT_CLIENTES_POR_PARAMS: "ObtenerClientesPorParametros",
				OBT_MAILS_POR_PARAMS: "ObtenerMailsPorParametros",
				OBT_TOTAL_USERS_CLI_CONECTADOS_RECIEN: "ObtenerTotalUsuariosClienteConectadosRecientemente",
				MARC_LEIDO_COMU_POR_ID_COMU_POR_ID_DEST: "MarcarLeidoComunicadoPorIdComunicadoPorIdDestinatario",
				TEST_SERV_CORREO_SMPT: "TestServidorCorreoSMTP",
				TEST_SERV_CORREO_POP3: "TestServidorCorreoPOP3",
				MANT_SERV_CORREO_EMI: "MantenimientoServidorCorreoEmision",
				MANT_SERV_CORREO_REC: "MantenimientoServidorCorreoRecepcion",
				OBT_SERV_CORREO_EMI: "ObtenerServidorCorreoEmision",
				OBT_SERV_CORREO_REC: "ObtenerServidorCorreoRecepcion",
				MANT_NOTI_CLIENTE: "MantenimientoNotificacionCliente",
				OBT_TIPO_ENV_NOTI_PLANT: "ObtenerTiposEnvioNotificacionPlantilla",
				OBT_NOTI_CLIENTE : "ObtenerNotificacionesCliente",
				OBT_COMU_POR_ID_TIPO_DEST_POR_DEST: "ObtenerComunicadosPorIdTipoDestinatarioPorDestinatario",
				OBT_TOTAL_NOTI_ENV_CLI: "ObtenerTotalNotificacionesEnviadasClientes",
				GUARDAR_CONTACTS_ALERT_COMU: "GuardarContactosAlertaComunicado",
				REGISTRAR_EVENT_USUARIO_CONSULTA: "RegistrarEventoUsuarioConsulta",
				CONSUL_CONFIG_INICIAL_EDOC_CONSULTA: "ConsultarConfiguracionInicialEdocConsulta",
				OBT_LOGO_RIDE: "ObtenerLogoRide",
				GUARDAR_LOGO_RIDE: "GuardarLogoRide",
				OBT_BANNER_RIDE: "ObtenerBannerRide",
				GUARDAR_BANNER_RIDE: "GuardarBannerRide",
				OBT_MAN_POR_ID_TIPO_DES_POR_DES: "ObtenerManualesPorIdTipoDestinatarioPorDestinatario",
				OBT_ESTADOS_MAIL: "ObtenerEstadosMail"
			}
		},
		API_SECURITY: {
			METHODS: {
				OBT_MIS_DATOS_USUARIO: "ObtenerMisDatosUsuario",
				OBT_TOTAL_USUARIOS: "ObtenerTotalUsuarios",
				OBT_HISTORIAL_CONEX_PORID_USER_CONSUL: "ObtenerHistorialConexionPorIdUsuarioConsulta",
				OBT_USUARIOS_CONSUL: "ObtenerUsuariosConsulta",
				OBT_ROLES_USER_CONSUL_PORID_COMPANIA: "ObtenerRolesUsuarioConsultaPorIdCompania",
				OBT_PERMISOS_PORID_ROL_USER_CONSUL: "ObtenerPermisosPorIdRolUsuarioConsulta",
				OBT_TOTAL_ROLES_USER_CONSUL: "ObtenerTotalRolesUsuarioConsulta",
				OBT_TOTAL_USERS_CONSUL_CONECT_RECIEN: "ObtenerTotalUsuariosConsultaConectadosRecientemente",
				OBT_TOTAL_USUARIOS_CONSUL: "ObtenerTotalUsuariosConsulta",
				MANT_USUARIO_CLIENTE: "MantenimientoUsuarioCliente",
				MANT_ROL_USUARIO_CONS: "MantenimientoRolUsuarioConsulta",
				MANT_USUARIO_CONS: "MantenimientoUsuarioConsulta",
				OBT_PERMISOS_ACT_CONS: "ObtenerPermisosActivosConsulta",
				OBT_HISTORIAL_EVE_USUARIO_CONS: "ObtenerHistorialEventosUsuarioConsulta"
			}
		},
		API_EMISION: {
			METHODS: {
				TOTAL_DOCU_EMITIDOS_HOY: "TotalDocumentosEmitidosHoy",
				OBT_ARCHIVO_DOC_EMI_X_CUFE: "ObtenerArchivoDocumentoEmisionPorCufe",
				OBT_DOCS_POR_ID_COMP_POR_CRI: "ObtenerDocumentosXIdCompaniaXCriterios",
				REE_MAIL_DOC_EMI: "ReenvioMailDocumentoEmitido",
				OBT_DOCS_POR_ID_COMP_POR_PAR: "ObtenerDocumentosXIdCompaniaXParametros",
				OBT_ESTADOS_EMISION: "ObtenerEstadosEmision",
				OBT_TIPOS_EMISION: "ObtenerTiposDocumento"
			}
		}
	}
}