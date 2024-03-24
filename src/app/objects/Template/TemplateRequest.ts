export interface TemplateRequest
{
    IdTemplate: number | undefined,
    Titulo: string;
    Descricao: string;
    QuantidadeTotal: number;
    IdTemplateCategoria: number;
    Escala: number,
    DescricaoCategoriaNova: string | undefined,
    IdUsuarioCadastro: number,
    LAtividade: Array<AtividadeTemplateRequest>,
    Foto: string | undefined,
}

export interface AtividadeTemplateRequest
{
    TempoPrevisto: number,
    IdTemplate: number | undefined,
    Titulo: string,
    Posicao: number,
    LTarefaTemplate: Array<TarefaTemplateRequest>
}

export interface  TarefaTemplateRequest
{
    Descricao: string;
    DescricaoTarefa: string;
    Prioridade: number,
    LTagsTarefa: Array<string>
}

