/**
 * MI DRUGSTORE - Sistema de Gestión
 * Módulo de Login
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value.toLowerCase().trim();

        // Ocultar mensaje de error previo
        errorMessage.classList.remove('show');

        // Validar credenciales
        // EMPLEADO: cualquier nombre de usuario + contraseña "empleado"
        // ADMIN: usuario "admin" + contraseña "admin"
        
        if (usuario === '') {
            mostrarError('Por favor ingrese un nombre de usuario');
            return;
        }

        if (password === 'admin' && usuario.toLowerCase() === 'admin') {
            // Login como Admin
            sessionStorage.setItem('usuarioLogueado', 'admin');
            sessionStorage.setItem('nombreUsuario', 'Administrador');
            window.location.href = 'admin.html';
        } else if (password === 'empleado') {
            // Login como Empleado (cualquier nombre de usuario)
            sessionStorage.setItem('usuarioLogueado', 'empleado');
            sessionStorage.setItem('nombreUsuario', usuario);
            window.location.href = 'empleado.html';
        } else {
            mostrarError('Contraseña incorrecta');
        }
    });

    function mostrarError(mensaje) {
        errorMessage.textContent = mensaje;
        errorMessage.classList.add('show');
        
        // Efecto de shake en el formulario
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }
});
