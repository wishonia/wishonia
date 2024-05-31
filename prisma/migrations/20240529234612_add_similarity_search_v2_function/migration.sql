-- New Hybrid Search Query
create or replace function kw_match_documents(query_text text, agent_id text, match_count int)
    returns table (id int, content text, metadata jsonb, similarity real)
as $$
begin
    return query execute
        format('select bt.id, bt.content, bt.metadata, ts_rank(to_tsvector(bt.content), plainto_tsquery($1)) as similarity
    from "AgentDocument" AS bt
    where to_tsvector(bt.content) @@ plainto_tsquery($1) and bt."agentId" = $2::text
    order by similarity desc
    limit $3')
        using query_text, agent_id, match_count;
end;
$$ language plpgsql;
-- New Search Query
CREATE OR REPLACE FUNCTION similarity_search_v2 (
    query_embedding vector,
    agentId text,
    match_count int DEFAULT null
) RETURNS TABLE (
                    id int,
                    content text,
                    metadata jsonb,
                    similarity float
                )
    LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
        SELECT
            bt.id,
            bt.content,
            bt.metadata,
            1 - (bt.embedding <=> query_embedding) AS similarity
        FROM "AgentDocument" AS bt
        WHERE bt."agentId" = similarity_search_v2.agentId -- Check agentId
        ORDER BY bt.embedding <=> query_embedding
        LIMIT match_count;
END;
$$;

