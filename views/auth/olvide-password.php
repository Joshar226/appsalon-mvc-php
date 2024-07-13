<h1 class="nombre-pagina">Olvidé mi Password</h1>
<p class="descripcion-pagina">Restablece tu password escribiendo tu email a conrinuación</p>

<?php include_once __DIR__ . '/../templates/alertas.php' ?>

<form class="formulario" method="post" action="/olvide">
    <div class="campo">
        <label for="email">Email</label>
        <input 
            type="email"
            id="email"
            placeholder="Tu Email"
            name="email"
        >
    </div>

    <input type="submit" class="boton" value="Enviar Instrucciones">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? <span>Inicia Sesión</span></a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? <span>Crear una</span></a>
</div>