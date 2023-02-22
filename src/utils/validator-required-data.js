export async function validatorFieldRequired(req, fields) {
  const mensagens = [];
  for await (const field of fields) {
    const valid = Object.entries(req.body).some(([key, value]) => {
      return key === field && value;
    });
    if (!valid) {
      mensagens.push({
        error: `O ${field} é de preenchimento obrigatório!`
      });
    } 
  }
  return mensagens;
}