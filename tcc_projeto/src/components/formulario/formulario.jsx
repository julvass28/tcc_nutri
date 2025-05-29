import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Botao from "../botao/Botao";
import { IoIosArrowDown } from "react-icons/io";
import "../formulario/formulario.css"

const formValidacao = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(40, "O nome não pode ter mais de 40 caracteres"),
  email: z.string().email("Email inválido."),
  telefone: z.string().regex(/^[0-9]{11}$/, "Telefone deve ter 11 digitos."),
  especialidade: z.string().nonempty("Especialidade é obrigatória."),
  mensagem: z.string().nonempty("Mensagem é obrigatória."),
});

export default function FormularioContato() {
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(formValidacao),
  });


  const onSubmit = async (data) => {
    console.log("Enviado (mock):", data);


    await new Promise((resolve) => setTimeout(resolve, 1500));

    setMensagemSucesso("Mensagem enviada com sucesso!");
    reset();

    setTimeout(() => {

      setMensagemSucesso("");
    }, 5000);

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formulario-contato">
      <div className="perguntas">
        <h1 className="form-text">ALGUMA DÚVIDA OU PERGUNTA?</h1>
        <p className="form-subtitulo">Envie agora, e eu responderei o mais breve possível.</p>
      </div>

      <div className="form-group">
        <label>Nome:</label>
        <input type="text" {...register("nome")} maxLength="40" />
        {errors.nome && <p className="error">{errors.nome.message}</p>}
      </div>


      <div className="form-group">
        <label>Email:</label>
        <input type="email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label>Telefone:</label>
        <input type="tel" {...register("telefone")} />
        {errors.telefone && <p className="error">{errors.telefone.message}</p>}
      </div>

      <div className="form-group">
        <label>Especialidade:</label>
        <div className="select-wrapper">
          <select {...register("especialidade")}>
            <option value="" disabled>Selecione</option>
            <option value="Nutrição Clínica">Nutrição Clínica</option>
            <option value="Nutrição Pediátrica">Nutrição Pediátrica</option>
            <option value="Nutrição Esportiva">Nutrição Esportiva</option>
            <option value="Emagrecimento">Emagrecimento e Obesidade</option>
            <option value="Intolerâncias">Intolerâncias Alimentares</option>
          </select>
          <IoIosArrowDown className="icone-mostrar" />
        </div>
        {errors.especialidade && <p className="error">{errors.especialidade.message}</p>}
      </div>

      <div className="form-group">
        <label>Mensagem:</label>
        <textarea {...register("mensagem")} />
        {errors.mensagem && <p className="error">{errors.mensagem.message}</p>}
      </div>


      <Botao className="botao-form" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Botao>


      {mensagemSucesso && <p className="sucesso">{mensagemSucesso}</p>}
    </form>
  );
}
