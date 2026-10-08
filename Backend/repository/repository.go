package repository

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"multicatalogo-backend/models"
)

type Repository struct {
	db *pgxpool.Pool
}

func New(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) BuscarUsuarioPorCredenciales(ctx context.Context, email, password string) (models.Usuario, error) {
	var usuario models.Usuario
	err := r.db.QueryRow(ctx,
		"SELECT id, email, rol FROM usuarios WHERE email = $1 AND password = $2",
		email, password,
	).Scan(&usuario.ID, &usuario.Email, &usuario.Rol)
	return usuario, err
}

func (r *Repository) ObtenerProductos(ctx context.Context) ([]models.Producto, error) {
	rows, err := r.db.Query(ctx,
		"SELECT id, nombre, descripcion, precio::double precision, categoria, img, galeria::text FROM productos ORDER BY id",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	productos := make([]models.Producto, 0)
	for rows.Next() {
		producto, err := scanProducto(rows)
		if err != nil {
			return nil, err
		}
		productos = append(productos, producto)
	}
	return productos, rows.Err()
}

func (r *Repository) ObtenerProductoPorID(ctx context.Context, id int) (models.Producto, error) {
	return scanProducto(r.db.QueryRow(ctx,
		"SELECT id, nombre, descripcion, precio::double precision, categoria, img, galeria::text FROM productos WHERE id = $1",
		id,
	))
}

type scanner interface {
	Scan(dest ...any) error
}

func scanProducto(row scanner) (models.Producto, error) {
	var producto models.Producto
	var galeriaJSON string
	if err := row.Scan(&producto.ID, &producto.Nombre, &producto.Descripcion, &producto.Precio, &producto.Categoria, &producto.Img, &galeriaJSON); err != nil {
		return producto, err
	}
	if err := json.Unmarshal([]byte(galeriaJSON), &producto.Galeria); err != nil {
		return producto, fmt.Errorf("galería inválida del producto %d: %w", producto.ID, err)
	}
	return producto, nil
}

func (r *Repository) ObtenerRed(ctx context.Context) (*models.Referido, error) {
	rows, err := r.db.Query(ctx, "SELECT id, nombre, nivel, ventas::double precision, parent_id FROM referidos ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	type nodo struct {
		referido *models.Referido
		parentID *int
	}
	nodos := make(map[int]nodo)
	orden := make([]int, 0)
	for rows.Next() {
		var referido models.Referido
		var parentID *int
		if err := rows.Scan(&referido.ID, &referido.Nombre, &referido.Nivel, &referido.Ventas, &parentID); err != nil {
			return nil, err
		}
		nodos[referido.ID] = nodo{referido: &referido, parentID: parentID}
		orden = append(orden, referido.ID)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	var raiz *models.Referido
	for _, id := range orden {
		actual := nodos[id]
		if actual.parentID == nil {
			if raiz != nil {
				return nil, fmt.Errorf("la red tiene más de una raíz")
			}
			raiz = actual.referido
			continue
		}
		padre, existe := nodos[*actual.parentID]
		if !existe {
			return nil, fmt.Errorf("referido %d sin padre %d", id, *actual.parentID)
		}
		padre.referido.Hijos = append(padre.referido.Hijos, actual.referido)
	}
	if raiz == nil {
		return nil, pgx.ErrNoRows
	}
	return raiz, nil
}
